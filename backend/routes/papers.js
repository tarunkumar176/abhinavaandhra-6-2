import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
// Import database configuration based on DB_TYPE
const dbType = process.env.DB_TYPE || 'sqlite';
const { query } = dbType === 'sqlite'
  ? await import('../config/database-sqlite.js')
  : await import('../config/database.js');
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all papers (public)
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, date, title, filename, file_url, file_size, 
        page_count, upload_timestamp, created_at, updated_at, thumbnail_url
      FROM papers 
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id.toString(),
        date: row.date,
        title: row.title,
        filename: row.filename,
        pdfUrl: row.file_url,
        fileSize: parseInt(row.file_size),
        pageCount: row.page_count,
        uploadTimestamp: parseInt(row.upload_timestamp),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        thumbnailUrl: row.thumbnail_url
      }))
    });
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch papers'
    });
  }
});

// Get paper by date (public)
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const result = await query(`
      SELECT 
        id, date, title, filename, file_url, file_size, 
        page_count, upload_timestamp, created_at, updated_at, thumbnail_url
      FROM papers 
      WHERE date = ?
    `, [date]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found for this date'
      });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id.toString(),
        date: row.date,
        title: row.title,
        filename: row.filename,
        pdfUrl: row.file_url,
        fileSize: parseInt(row.file_size),
        pageCount: row.page_count,
        uploadTimestamp: parseInt(row.upload_timestamp),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        thumbnailUrl: row.thumbnail_url
      }
    });
  } catch (error) {
    console.error('Error fetching paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch paper'
    });
  }
});

// Get recent papers (public)
router.get('/recent/:days', async (req, res) => {
  try {
    const days = parseInt(req.params.days) || 7;

    if (days < 1 || days > 30) {
      return res.status(400).json({
        success: false,
        message: 'Days must be between 1 and 30'
      });
    }

    const result = await query(`
      SELECT 
        id, date, title, filename, file_url, file_size, 
        page_count, upload_timestamp, created_at, updated_at, thumbnail_url
      FROM papers 
      WHERE date >= date('now', '-${days} days')
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id.toString(),
        date: row.date,
        title: row.title,
        filename: row.filename,
        pdfUrl: row.file_url,
        fileSize: parseInt(row.file_size),
        pageCount: row.page_count,
        uploadTimestamp: parseInt(row.upload_timestamp),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        thumbnailUrl: row.thumbnail_url
      }))
    });
  } catch (error) {
    console.error('Error fetching recent papers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent papers'
    });
  }
});

// Upload new paper (admin only)
router.post('/upload',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  handleUploadError,
  async (req, res) => {
    try {
      const { date, title } = req.body;
      const pdfFile = req.files?.pdf?.[0];
      const thumbnailFile = req.files?.thumbnail?.[0];

      console.log('Upload request:', {
        date,
        title,
        pdf: pdfFile ? pdfFile.filename : 'none',
        thumbnail: thumbnailFile ? thumbnailFile.filename : 'none',
        replace: req.query.replace
      });

      if (!pdfFile) {
        if (thumbnailFile) {
          await fs.remove(thumbnailFile.path);
        }
        return res.status(400).json({
          success: false,
          message: 'PDF file is required'
        });
      }

      if (!date || !title) {
        await fs.remove(pdfFile.path);
        if (thumbnailFile) {
          await fs.remove(thumbnailFile.path);
        }
        return res.status(400).json({
          success: false,
          message: 'Date and title are required'
        });
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        await fs.remove(pdfFile.path);
        if (thumbnailFile) {
          await fs.remove(thumbnailFile.path);
        }
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      // Check if paper already exists for this date
      const existingPaper = await query(
        'SELECT id, file_path, thumbnail_url FROM papers WHERE date = ?',
        [date]
      );

      // If paper exists and replace=true, update it
      if (existingPaper.rows.length > 0 && req.query.replace === 'true') {
        const oldPaper = existingPaper.rows[0];

        // Delete old PDF file
        try {
          await fs.remove(oldPaper.file_path);
        } catch (err) {
          console.warn('Failed to delete old PDF:', err);
        }

        // Delete old thumbnail if exists
        if (oldPaper.thumbnail_url) {
          try {
            const oldThumbFilename = oldPaper.thumbnail_url.split('/').pop();
            const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
            if (oldThumbFilename) {
              await fs.remove(path.join(uploadDir, oldThumbFilename));
            }
          } catch (err) {
            console.warn('Failed to delete old thumbnail:', err);
          }
        }

        // Generate file URLs
        const pdfFileUrl = `${req.protocol}://${req.get('host')}/uploads/${pdfFile.filename}`;
        const thumbnailUrl = thumbnailFile
          ? `${req.protocol}://${req.get('host')}/uploads/${thumbnailFile.filename}`
          : oldPaper.thumbnail_url; // Keep old thumbnail if no new one provided

        // Update existing record
        await query(`
          UPDATE papers SET 
            title = ?, 
            filename = ?, 
            file_path = ?, 
            file_url = ?, 
            file_size = ?, 
            upload_timestamp = ?,
            thumbnail_url = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [
          title,
          pdfFile.originalname,
          pdfFile.path,
          pdfFileUrl,
          pdfFile.size,
          Date.now(),
          thumbnailUrl,
          oldPaper.id
        ]);

        console.log('Paper replaced successfully:', { date, title, pdfFileUrl, thumbnailUrl });

        return res.json({
          success: true,
          data: {
            id: oldPaper.id.toString(),
            date: date,
            title: title,
            filename: pdfFile.originalname,
            pdfUrl: pdfFileUrl,
            fileSize: pdfFile.size,
            pageCount: 1,
            uploadTimestamp: Date.now(),
            updatedAt: new Date().toISOString(),
            thumbnailUrl: thumbnailUrl
          },
          message: 'Paper replaced successfully'
        });
      }

      // If paper exists but replace is not true, return conflict error
      if (existingPaper.rows.length > 0) {
        await fs.remove(pdfFile.path);
        if (thumbnailFile) {
          await fs.remove(thumbnailFile.path);
        }
        return res.status(409).json({
          success: false,
          message: 'Paper already exists for this date. Use ?replace=true to overwrite, or delete it first.'
        });
      }

      // Generate file URLs for new paper
      const pdfFileUrl = `${req.protocol}://${req.get('host')}/uploads/${pdfFile.filename}`;
      const thumbnailUrl = thumbnailFile
        ? `${req.protocol}://${req.get('host')}/uploads/${thumbnailFile.filename}`
        : null;

      // Save new paper to database
      const result = await query(`
        INSERT INTO papers (
          date, title, filename, file_path, file_url, 
          file_size, page_count, upload_timestamp, thumbnail_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        date,
        title,
        pdfFile.originalname,
        pdfFile.path,
        pdfFileUrl,
        pdfFile.size,
        1, // Default page count
        Date.now(),
        thumbnailUrl
      ]);

      console.log('Paper uploaded successfully:', { date, title, pdfFileUrl, thumbnailUrl });

      res.status(201).json({
        success: true,
        data: {
          id: result.lastID.toString(),
          date: date,
          title: title,
          filename: pdfFile.originalname,
          pdfUrl: pdfFileUrl,
          fileSize: pdfFile.size,
          pageCount: 1,
          uploadTimestamp: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          thumbnailUrl: thumbnailUrl
        },
        message: 'Paper uploaded successfully'
      });

    } catch (error) {
      if (req.files?.pdf?.[0]) {
        await fs.remove(req.files.pdf[0].path).catch(console.error);
      }
      if (req.files?.thumbnail?.[0]) {
        await fs.remove(req.files.thumbnail[0].path).catch(console.error);
      }

      console.error('Upload error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Failed to upload paper: ' + error.message
      });
    }
  }
);

// Delete paper (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const paperResult = await query(
      'SELECT file_path, thumbnail_url FROM papers WHERE id = ?',
      [id]
    );

    if (paperResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    const paper = paperResult.rows[0];

    await query('DELETE FROM papers WHERE id = ?', [id]);

    // Delete PDF file
    try {
      await fs.remove(paper.file_path);
    } catch (fileError) {
      console.warn('Could not delete PDF file:', fileError.message);
    }

    // Delete thumbnail if exists
    if (paper.thumbnail_url) {
      try {
        const thumbFilename = paper.thumbnail_url.split('/').pop();
        const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
        if (thumbFilename) {
          await fs.remove(path.join(uploadDir, thumbFilename));
        }
      } catch (thumbError) {
        console.warn('Could not delete thumbnail file:', thumbError.message);
      }
    }

    res.json({
      success: true,
      message: 'Paper deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete paper'
    });
  }
});

export default router;