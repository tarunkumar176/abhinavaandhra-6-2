import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PDFProcessor {
  constructor() {
    this.outputDir = path.join(__dirname, '..', 'uploads', 'pages');
    this.ensureOutputDir();
  }

  async ensureOutputDir() {
    await fs.ensureDir(this.outputDir);
  }

  /**
   * Convert PDF to high-quality images
   * @param {string} pdfPath - Path to PDF file
   * @param {string} paperDate - Date string for organizing files
   * @returns {Promise<Array>} Array of image paths and metadata
   */
  async convertPdfToImages(pdfPath, paperDate) {
    const isWindows = os.platform() === 'win32';

    try {
      console.log(`🔄 Converting PDF to images: ${pdfPath}`);
      console.log(`💻 Detected Platform: ${os.platform()}`);

      // Create date-specific folder
      const dateFolder = path.join(this.outputDir, paperDate);
      await fs.ensureDir(dateFolder);

      let imageBuffers = [];
      let totalPages = 0;

      if (isWindows) {
        // --- WINDOWS STRATEGY (pdf-poppler) ---
        console.log('🏁 Using pdf-poppler (Windows)...');
        // Dynamic import to avoid issues on Linux
        const { default: pdf } = await import('pdf-poppler');

        const options = {
          format: 'png',
          out_dir: dateFolder,
          out_prefix: 'page',
          page: null,
          scale: 2048
        };

        await pdf.convert(pdfPath, options);

        // Count generated files
        const files = await fs.readdir(dateFolder);
        const pngFiles = files.filter(f => f.startsWith('page-') && f.endsWith('.png'));
        totalPages = pngFiles.length;
        console.log(`📄 Generated ${totalPages} PNG files via pdf-poppler`);

        // Prepare for processing
        for (let i = 1; i <= totalPages; i++) {
          const inputPath = path.join(dateFolder, `page-${i}.png`);
          if (await fs.pathExists(inputPath)) {
            imageBuffers.push({
              buffer: inputPath, // sharp accepts path
              pageNum: i,
              isPath: true // flag to know we need to delete it
            });
          }
        }

      } else {
        // --- LINUX/RENDER STRATEGY (pdf-img-convert) ---
        console.log('🐧 Using pdf-img-convert (Linux/Render)...');
        // Dynamic import to avoid issues on Windows local dev
        const { default: pdf2img } = await import('pdf-img-convert');

        const pdfData = await pdf2img.convert(pdfPath, {
          scale: 2.5 // ~180dpi
        });

        totalPages = pdfData.length;
        console.log(`📄 Generated ${totalPages} page buffers in memory`);

        pdfData.forEach((buffer, index) => {
          imageBuffers.push({
            buffer: buffer,
            pageNum: index + 1,
            isPath: false
          });
        });
      }

      console.log('🖼️  Processing images into WebP...');
      const imageResults = [];

      for (const item of imageBuffers) {
        const { buffer, pageNum, isPath } = item;

        // Define paths
        const highQualityPath = path.join(dateFolder, `page-${pageNum}-hq.webp`);
        const mediumQualityPath = path.join(dateFolder, `page-${pageNum}-mq.webp`);
        const thumbnailPath = path.join(dateFolder, `page-${pageNum}-thumb.webp`);

        // Create versions
        await sharp(buffer).webp({ quality: 95, effort: 4 }).toFile(highQualityPath);
        await sharp(buffer).webp({ quality: 80, effort: 4 }).toFile(mediumQualityPath);
        await sharp(buffer).resize(400, 566, { fit: 'inside' }).webp({ quality: 70 }).toFile(thumbnailPath);

        // If it was a temp file from pdf-poppler, delete it
        if (isPath) {
          await fs.remove(buffer);
        }

        imageResults.push({
          pageNumber: pageNum,
          highQuality: `/uploads/pages/${paperDate}/page-${pageNum}-hq.webp`,
          mediumQuality: `/uploads/pages/${paperDate}/page-${pageNum}-mq.webp`,
          thumbnail: `/uploads/pages/${paperDate}/page-${pageNum}-thumb.webp`,
          width: 2048,
          height: Math.round(2048 * 1.414)
        });
      }

      console.log(`✅ Successfully processed ${imageResults.length} pages`);
      return {
        totalPages: imageResults.length,
        pages: imageResults
      };

    } catch (error) {
      console.error('❌ PDF conversion failed:', error);
      throw new Error(`PDF conversion failed: ${error.message}`);
    }
  }

  /**
   * Clean up old images when paper is deleted
   */
  async cleanupImages(paperDate) {
    try {
      const dateFolder = path.join(this.outputDir, paperDate);
      if (await fs.pathExists(dateFolder)) {
        await fs.remove(dateFolder);
        console.log(`🗑️  Cleaned up images for ${paperDate}`);
      }
    } catch (error) {
      console.error('Error cleaning up images:', error);
    }
  }

  /**
   * Get image URLs for a paper
   */
  getImageUrls(paperDate, totalPages, baseUrl = '') {
    const pages = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      pages.push({
        pageNumber: pageNum,
        highQuality: `${baseUrl}/uploads/pages/${paperDate}/page-${pageNum}-hq.webp`,
        mediumQuality: `${baseUrl}/uploads/pages/${paperDate}/page-${pageNum}-mq.webp`,
        thumbnail: `${baseUrl}/uploads/pages/${paperDate}/page-${pageNum}-thumb.webp`
      });
    }

    return pages;
  }
}

export default new PDFProcessor();