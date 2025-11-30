// Import database configuration based on DB_TYPE
const dbType = process.env.DB_TYPE || 'sqlite';
const { query } = dbType === 'sqlite'
  ? await import('../config/database-sqlite.js')
  : await import('../config/database.js');
import fs from 'fs-extra';

export async function cleanupOldPapers() {
  try {
    console.log('Starting cleanup of papers older than 7 days...');

    // Get papers older than 7 days
    // SQLite syntax: date('now', '-7 days')
    const result = await query(`
      SELECT id, file_path, title, date 
      FROM papers 
      WHERE date < date('now', '-7 days')
    `);

    if (result.rows.length === 0) {
      console.log('No old papers found to cleanup');
      return;
    }

    console.log(`Found ${result.rows.length} papers to cleanup`);

    let deletedCount = 0;
    let errorCount = 0;

    for (const paper of result.rows) {
      try {
        // Delete from database first
        // Use ? for SQLite compatibility
        await query('DELETE FROM papers WHERE id = ?', [paper.id]);

        // Then delete file from filesystem
        try {
          await fs.remove(paper.file_path);
          // paper.date is a string in SQLite, so just use it directly
          console.log(`Deleted paper: ${paper.title} (${paper.date})`);
        } catch (fileError) {
          console.warn(`Could not delete file for paper ${paper.id}:`, fileError.message);
        }

        deletedCount++;
      } catch (error) {
        console.error(`Error deleting paper ${paper.id}:`, error);
        errorCount++;
      }
    }

    console.log(`Cleanup completed: ${deletedCount} papers deleted, ${errorCount} errors`);

    return {
      deletedCount,
      errorCount,
      totalFound: result.rows.length
    };

  } catch (error) {
    console.error('Cleanup job failed:', error);
    throw error;
  }
}