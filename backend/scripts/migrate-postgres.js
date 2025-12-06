import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'telugu_epaper',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting PostgreSQL migration...');

    // Check if thumbnail_url column exists
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'papers' AND column_name = 'thumbnail_url'
    `);

    if (columnCheck.rows.length === 0) {
      console.log('📝 Adding thumbnail_url column to papers table...');
      await client.query('ALTER TABLE papers ADD COLUMN thumbnail_url VARCHAR(500)');
      console.log('✅ thumbnail_url column added successfully');
    } else {
      console.log('✅ thumbnail_url column already exists');
    }

    // Check if breaking_news table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'breaking_news'
    `);

    if (tableCheck.rows.length === 0) {
      console.log('📝 Creating breaking_news table...');
      await client.query(`
        CREATE TABLE breaking_news (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ breaking_news table created successfully');
    } else {
      console.log('✅ breaking_news table already exists');
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
