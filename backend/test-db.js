import { initializeDatabase, query } from './config/database-sqlite.js';

async function testDB() {
  try {
    await initializeDatabase();
    const result = await query('SELECT date, title, file_url FROM papers ORDER BY date DESC LIMIT 3');
    console.log('Papers in database:');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

testDB();
