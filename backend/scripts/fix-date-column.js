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

async function fixDateColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Fixing date column type...');

    // Check current column type
    const columnInfo = await client.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'papers' AND column_name = 'date'
    `);

    console.log('Current date column type:', columnInfo.rows[0]?.data_type);

    if (columnInfo.rows[0]?.data_type === 'date') {
      console.log('📝 Converting DATE column to VARCHAR...');
      
      // Change column type to VARCHAR
      await client.query(`
        ALTER TABLE papers 
        ALTER COLUMN date TYPE VARCHAR(10) 
        USING to_char(date, 'YYYY-MM-DD')
      `);
      
      console.log('✅ Date column converted to VARCHAR');
    } else {
      console.log('✅ Date column is already VARCHAR');
    }

    // Show current papers
    const papers = await client.query('SELECT id, date, title FROM papers ORDER BY date DESC');
    console.log('\n📰 Papers after fix:');
    papers.rows.forEach(p => {
      console.log(`  - ${p.date}: ${p.title}`);
    });

    console.log('\n🎉 Migration completed successfully!');
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

fixDateColumn();
