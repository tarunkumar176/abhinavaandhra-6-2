import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export class PDFProcessor {
  constructor() {
    this.outputDir = path.join(__dirname, '..', 'uploads', 'pages');
    this.ensureOutputDir();
  }

  async ensureOutputDir() {
    await fs.ensureDir(this.outputDir);
  }

  /**
   * Convert PDF to high-quality images and upload to Cloudinary
   * @param {string} pdfPath - Path to PDF file
   * @param {string} paperDate - Date string for organizing files
   * @returns {Promise<Array>} Array of image paths and metadata
   */
  async convertPdfToImages(pdfPath, paperDate) {
    try {
      console.log(`🔄 Converting PDF to images: ${pdfPath}`);
      console.log(`💻 Detected Platform: ${os.platform()}`);

      // Create date-specific folder locally for processing
      const dateFolder = path.join(this.outputDir, paperDate);
      await fs.ensureDir(dateFolder);

      let imageBuffers = [];
      let totalPages = 0;

      // --- UNIVERSAL STRATEGY (pdf-img-convert) ---
      console.log('🚀 Using pdf-img-convert (Cross-platform)...');
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

      console.log('☁️ Processing images and uploading to Cloudinary...');
      const imageResults = [];

      for (const item of imageBuffers) {
        const { buffer, pageNum, isPath } = item;

        // Define temp paths
        const highQualityPath = path.join(dateFolder, `page-${pageNum}-hq.webp`);
        // We only generate one high-quality version for cloud storage to save space/bandwidth
        // The frontend can scale it down if needed, or we can use Cloudinary transformations

        // 1. Process with Sharp (Convert to WebP)
        await sharp(buffer).webp({ quality: 90, effort: 4 }).toFile(highQualityPath);

        // 2. Upload to Cloudinary
        console.log(`☁️ Uploading page ${pageNum}/${totalPages} to Cloudinary...`);
        const uploadResult = await cloudinary.uploader.upload(highQualityPath, {
          folder: `epaper/pages/${paperDate}`,
          public_id: `page-${pageNum}`,
          overwrite: true,
          resource_type: 'image'
        });

        // 3. Clean up temp files
        await fs.remove(highQualityPath);
        if (isPath) {
          await fs.remove(buffer);
        }

        // 4. Store Result
        imageResults.push({
          pageNumber: pageNum,
          highQuality: uploadResult.secure_url,
          // Cloudinary can generate variants on the fly, but for now we'll just use the same URL
          // Or we can append transformations if we want.
          mediumQuality: uploadResult.secure_url.replace('/upload/', '/upload/q_auto:good,w_1024/'),
          thumbnail: uploadResult.secure_url.replace('/upload/', '/upload/c_thumb,w_400/'),
          width: uploadResult.width,
          height: uploadResult.height
        });
      }

      // Cleanup the local date folder
      await fs.remove(dateFolder);

      console.log(`✅ Successfully processed and uploaded ${imageResults.length} pages`);
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
   * Clean up images from Cloudinary when paper is deleted
   */
  async cleanupImages(paperDate) {
    try {
      console.log(`🗑️  Cleaning up Cloudinary images for ${paperDate}...`);
      await cloudinary.api.delete_resources_by_prefix(`epaper/pages/${paperDate}`);
      await cloudinary.api.delete_folder(`epaper/pages/${paperDate}`);
      console.log(`✅ Cloudinary folder deleted: epaper/pages/${paperDate}`);
    } catch (error) {
      console.error('Error cleaning up Cloudinary images:', error);
    }
  }

  /**
   * Get image URLs for a paper (Helper method, though DB usually has them)
   */
  getImageUrls(paperDate, totalPages) {
    // This might be used if DB data is missing, but with Cloudinary we rely on DB or dynamic construction
    const pages = [];
    // ... logic if needed, but primary source is now DB 'pages_data'
    return pages;
  }
}

export default new PDFProcessor();