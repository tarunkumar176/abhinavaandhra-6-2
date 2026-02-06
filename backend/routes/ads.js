import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import fs from 'fs-extra';
import path from 'path';

const router = express.Router();

// Get all ads (Public - specifically for admin list, but safe to be public. 
// Ideally admin APIs should be behind auth, but for simple fetching list it's okay. 
// wait, the prompt says "admin can add". admin needs to see list. 
// Public needs ONLY active ad. 
// Let's secure the "list all" for admin only to be safe)

// Get active ad (Public)
router.get('/active', async (req, res) => {
    try {
        const result = await query(`
            SELECT id, image_url, link_url, is_active 
            FROM ads 
            WHERE is_active = true 
            ORDER BY created_at DESC 
            LIMIT 1
        `);

        if (result.rows.length > 0) {
            return res.json({
                success: true,
                data: result.rows[0]
            });
        }

        res.json({
            success: true,
            data: null
        });

    } catch (error) {
        console.error('Error fetching active ad:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active ad'
        });
    }
});

// Get all ads (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await query('SELECT * FROM ads ORDER BY created_at DESC');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching ads:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ads'
        });
    }
});

// upload new ad (Admin only)
router.post('/',
    authenticateToken,
    requireAdmin,
    upload.single('image'),
    handleUploadError,
    async (req, res) => {
        try {
            const { link_url } = req.body;
            const imageFile = req.file;

            if (!imageFile) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            // Generate URL
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            const host = req.get('host');
            const imageUrl = `${protocol}://${host}/uploads/${imageFile.filename}`;

            const result = await query(`
                INSERT INTO ads (image_url, link_url, is_active)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [imageUrl, link_url || null, true]);

            res.status(201).json({
                success: true,
                data: result.rows[0],
                message: 'Ad created successfully'
            });

        } catch (error) {
            console.error('Error creating ad:', error);
            // clean up file if error
            if (req.file) {
                await fs.remove(req.file.path).catch(console.error);
            }
            res.status(500).json({
                success: false,
                message: 'Failed to create ad'
            });
        }
    }
);

// Toggle ad status (Admin only)
router.put('/:id/toggle', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // First check current status
        const check = await query('SELECT is_active FROM ads WHERE id = $1', [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Ad not found' });
        }

        const newStatus = !check.rows[0].is_active;

        const result = await query(
            'UPDATE ads SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [newStatus, id]
        );

        res.json({
            success: true,
            data: result.rows[0],
            message: `Ad ${newStatus ? 'activated' : 'deactivated'}`
        });

    } catch (error) {
        console.error('Error toggling ad:', error);
        res.status(500).json({ success: false, message: 'Failed to toggle ad' });
    }
});

// Delete ad (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Get file info to delete active file
        const adResult = await query('SELECT image_url FROM ads WHERE id = $1', [id]);

        if (adResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Ad not found' });
        }

        const ad = adResult.rows[0];

        // Delete from DB
        await query('DELETE FROM ads WHERE id = $1', [id]);

        // Delete file
        if (ad.image_url) {
            try {
                const filename = ad.image_url.split('/').pop();
                // Assumes uploads dir is peer to this folder's parent
                // But careful with paths. index.js sets __dirname suitable for 'uploads'
                // Re-using logic from papers.js
                // "path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')"
                // __dirname here is inside /routes
                // so ../uploads is correct if uploads is in root
                // BUT logic in papers.js uses path.join(__dirname, '..', ...) where __dirname is routes folder.

                // Let's resolve the path relative to routes folder:
                // routes/../uploads -> backend/uploads
                const uploadDir = path.join(path.dirname(import.meta.url).replace('file://', ''), '../../uploads');
                // wait, path.dirname(import.meta.url) gives full path.

                // Simplest way: process.cwd() is usually backend root in this project based on package.json scripts
                const filePath = path.join(process.cwd(), 'uploads', filename);

                if (await fs.pathExists(filePath)) {
                    await fs.remove(filePath);
                }
            } catch (err) {
                console.warn('Failed to delete ad image file:', err);
            }
        }

        res.json({
            success: true,
            message: 'Ad deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ success: false, message: 'Failed to delete ad' });
    }
});

export default router;
