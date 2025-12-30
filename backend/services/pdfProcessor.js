import pdf from 'pdf-poppler';
import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

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
    try {
      console.log(`🔄 Converting PDF to images: ${pdfPath}`);
      
      // Create date-specific folder
      const dateFolder = path.join(this.outputDir, paperDate);
      await fs.ensureDir(dateFolder);

      // Configure pdf-poppler options
      const options = {
        format: 'png',
        out_dir: dateFolder,
        out_prefix: 'page',
        page: null, // Convert all pages
        scale: 2048 // High resolution
      };

      // Convert PDF to images
      console.log('📄 Starting PDF conversion...');
      const pdfData = await pdf.convert(pdfPath, options);
      
      console.log(`📄 PDF converted to ${pdfData.length} pages`);

      const imageResults = [];
      
      // Process each generated image
      for (let i = 0; i < pdfData.length; i++) {
        const pageNum = i + 1;
        const inputImagePath = path.join(dateFolder, `page-${pageNum}.png`);
        
        console.log(`🖼️  Processing page ${pageNum}/${pdfData.length}`);
        
        if (await fs.pathExists(inputImagePath)) {
          // Create high-quality WebP version
          const highQualityPath = path.join(dateFolder, `page-${pageNum}-hq.webp`);
          await sharp(inputImagePath)
            .webp({ quality: 95, effort: 6 })
            .toFile(highQualityPath);
          
          // Create medium-quality version
          const mediumQualityPath = path.join(dateFolder, `page-${pageNum}-mq.webp`);
          await sharp(inputImagePath)
            .webp({ quality: 80, effort: 6 })
            .toFile(mediumQualityPath);
          
          // Create thumbnail
          const thumbnailPath = path.join(dateFolder, `page-${pageNum}-thumb.webp`);
          await sharp(inputImagePath)
            .resize(400, 566, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 70, effort: 6 })
            .toFile(thumbnailPath);
          
          // Remove original PNG file to save space
          await fs.remove(inputImagePath);
          
          imageResults.push({
            pageNumber: pageNum,
            highQuality: `/uploads/pages/${paperDate}/page-${pageNum}-hq.webp`,
            mediumQuality: `/uploads/pages/${paperDate}/page-${pageNum}-mq.webp`,
            thumbnail: `/uploads/pages/${paperDate}/page-${pageNum}-thumb.webp`,
            width: 2048,
            height: Math.round(2048 * 1.414) // A4 ratio
          });
        }
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