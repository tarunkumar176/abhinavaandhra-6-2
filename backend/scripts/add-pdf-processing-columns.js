import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'telugu_epaper',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
      }
);

async function addPdfProcessingColumns() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Adding PDF processing columns...');

    // Check if columns already exist
    const columnsCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'papers' 
      AND column_name IN ('pages_data', 'processing_status')
    `);

    const existingColumns = columnsCheck.rows.map(row => row.column_name);
    
    if (!existingColumns.includes('pages_data')) {
      console.log('📝 Adding pages_data column...');
      await client.query('ALTER TABLE papers ADD COLUMN pages_data JSONB');
      console.log('✅ pages_data column added');
    } else {
      console.log('✅ pages_data column already exists');
    }

    if (!existingColumns.includes('processing_status')) {
      console.log('📝 Adding processing_status column...');
      await client.query("ALTER TABLE papers ADD COLUMN processing_status VARCHAR(20) DEFAULT 'pending'");
      console.log('✅ processing_status column added');
    } else {
      console.log('✅ processing_status column already exists');
    }

    // Update existing papers to have 'completed' status (assuming they're already processed)
    const updateResult = await client.query(`
      UPDATE papers 
      SET processing_status = 'completed' 
      WHERE processing_status IS NULL OR processing_status = 'pending'
    `);
    
    console.log(`📊 Updated ${updateResult.rowCount} existing papers to 'completed' status`);

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

addPdfProcessingColumns();