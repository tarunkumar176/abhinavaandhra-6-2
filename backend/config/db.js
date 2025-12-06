import dotenv from 'dotenv';
dotenv.config();

const dbType = process.env.DB_TYPE || 'sqlite';

let query, initializeDatabase;

if (dbType === 'sqlite') {
  const sqlite = await import('./database-sqlite.js');
  query = sqlite.query;
  initializeDatabase = sqlite.initializeDatabase;
} else {
  const postgres = await import('./database.js');
  query = postgres.query;
  initializeDatabase = postgres.initializeDatabase;
}

export { query, initializeDatabase };
