import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'data', 'epaper.db');
await fs.ensureDir(path.join(__dirname, '..', 'data'));

let db;

// Initialize database
export async function initializeDatabase() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      page_count INTEGER DEFAULT 1,
      upload_timestamp INTEGER NOT NULL,
      thumbnail_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS breaking_news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration: Add new columns if they don't exist
  try {
    const tableInfo = await db.all('PRAGMA table_info(papers)');
    const existingColumns = tableInfo.map(col => col.name);

    if (!existingColumns.includes('thumbnail_url')) {
      console.log('📝 Adding thumbnail_url column to papers table...');
      await db.exec('ALTER TABLE papers ADD COLUMN thumbnail_url TEXT');
      console.log('✅ Migration completed: thumbnail_url column added');
    }

    if (!existingColumns.includes('processing_status')) {
      console.log('📝 Adding processing_status column to papers table...');
      await db.exec("ALTER TABLE papers ADD COLUMN processing_status TEXT DEFAULT 'pending'");
      console.log('✅ Migration completed: processing_status column added');
    }

    if (!existingColumns.includes('pages_data')) {
      console.log('📝 Adding pages_data column to papers table...');
      await db.exec('ALTER TABLE papers ADD COLUMN pages_data TEXT'); // SQLite stores JSON as TEXT
      console.log('✅ Migration completed: pages_data column added');
    }

  } catch (migrationError) {
    console.error('Migration error:', migrationError);
  }

  // Seed admin user if not exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@teluguepaper.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', [adminEmail]);

  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await db.run('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [adminEmail, hashed, 'admin']);
    console.log('✅ Default admin created:', adminEmail);
  }

  console.log('📦 SQLite database initialized at:', dbPath);
}

// Query helper
export async function query(sql, params = []) {
  if (!db) throw new Error('Database not initialized');

  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    const rows = await db.all(sql, params);
    return { rows };
  } else {
    const result = await db.run(sql, params);
    return { lastID: result.lastID, changes: result.changes };
  }
}
