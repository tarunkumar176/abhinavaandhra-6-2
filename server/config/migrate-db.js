import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'data', 'epaper.db');

async function migrateDatabase() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('Starting database migration...');

    // Check if thumbnail_url column exists
    const tableInfo = await db.all('PRAGMA table_info(papers)');
    const hasThumbColumn = tableInfo.some(col => col.name === 'thumbnail_url');

    if (!hasThumbColumn) {
      console.log('Adding thumbnail_url column to papers table...');
      await db.exec('ALTER TABLE papers ADD COLUMN thumbnail_url TEXT');
      console.log('✅ thumbnail_url column added successfully');
    } else {
      console.log('✅ thumbnail_url column already exists');
    }

    await db.close();
    console.log('✅ Database migration completed');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

migrateDatabase();
