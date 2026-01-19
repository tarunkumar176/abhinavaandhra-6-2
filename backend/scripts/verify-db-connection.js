import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

console.log('Testing connection to:', process.env.DATABASE_URL?.split('@')[1]); // Log only host for security

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Successfully connected to PostgreSQL!');

        // Check if tables exist
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log('📊 Existing tables:', res.rows.map(r => r.table_name).join(', '));

        client.release();
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }
}

testConnection();
