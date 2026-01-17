
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { query, initializeDatabase } from '../config/db.js';
import pdfProcessor from '../services/pdfProcessor.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function reprocessAllPapers() {
    try {
        await initializeDatabase();
        console.log('🔄 Starting full PDF reprocessing...');

        // Get all papers
        const result = await query('SELECT id, date, filename, file_url, file_path FROM papers ORDER BY date DESC');
        console.log(`📊 Found ${result.rows.length} papers to process`);

        for (const paper of result.rows) {
            console.log(`\n📄 Processing paper: ${paper.date} (${paper.filename})`);

            try {
                // Resolve absolute path to PDF
                // Check if file_path is already absolute or relative to project root
                let pdfPath = paper.file_path;

                // If path doesn't verify, try to construct it
                if (!await fs.pathExists(pdfPath)) {
                    const uploadDir = path.join(__dirname, '..', 'uploads');
                    pdfPath = path.join(uploadDir, paper.filename);
                }

                if (!await fs.pathExists(pdfPath)) {
                    console.warn(`⚠️ PDF file not found for ${paper.date}: ${pdfPath}`);
                    continue;
                }

                console.log(`Using PDF path: ${pdfPath}`);

                // Update status to processing
                await query(
                    'UPDATE papers SET processing_status = ? WHERE id = ?',
                    ['processing', paper.id]
                );

                // Convert
                const conversionResult = await pdfProcessor.convertPdfToImages(pdfPath, paper.date);

                // Update DB
                await query(`
            UPDATE papers SET 
                page_count = ?,
                processing_status = ?,
                pages_data = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
                    conversionResult.totalPages,
                    'completed',
                    JSON.stringify(conversionResult.pages),
                    paper.id
                ]);

                console.log(`✅ Successfully reprocessed paper ${paper.id}`);

            } catch (err) {
                console.error(`❌ Failed to process paper ${paper.id}:`, err.message);
                await query(
                    'UPDATE papers SET processing_status = ? WHERE id = ?',
                    ['failed', paper.id]
                );
            }
        }

        console.log('\n🎉 Reprocessing complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

reprocessAllPapers();
