import dotenv from 'dotenv';
import { initializeDatabase, query } from './config/database.js';

dotenv.config();

async function testPostgreSQL() {
  try {
    console.log('🔍 Testing PostgreSQL connection...');
    console.log('Configuration:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });

    console.log('\n📦 Initializing database...');
    await initializeDatabase();

    console.log('\n✅ Database initialized successfully!');

    console.log('\n📊 Checking tables...');
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables found:', tables.rows.map(r => r.table_name));

    console.log('\n👤 Checking users...');
    const users = await query('SELECT id, email, role FROM users');
    console.log('Users:', users.rows);

    console.log('\n📰 Checking papers...');
    const papers = await query('SELECT id, date, title FROM papers ORDER BY date DESC LIMIT 5');
    console.log('Papers:', papers.rows);

    console.log('\n🎉 PostgreSQL is working correctly!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testPostgreSQL();
