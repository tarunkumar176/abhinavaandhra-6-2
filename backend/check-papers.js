import { initializeDatabase, query } from './config/db.js';

async function checkPapers() {
  try {
    await initializeDatabase();
    
    console.log('\n📰 All papers in database:');
    const papers = await query('SELECT id, date, title, file_url FROM papers ORDER BY date DESC');
    console.log(papers.rows);
    
    console.log('\n📅 Today\'s date check:');
    const today = new Date().toISOString().split('T')[0];
    console.log('Today:', today);
    
    const todayPaper = await query('SELECT * FROM papers WHERE date = ?', [today]);
    console.log('Today\'s paper:', todayPaper.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPapers();
