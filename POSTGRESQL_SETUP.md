# PostgreSQL Setup Guide

## Prerequisites

### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run the installer
- Remember the password you set for the `postgres` user
- Default port: 5432

**Or use Docker:**
```bash
docker run --name telugu-epaper-postgres -e POSTGRES_PASSWORD=Tarun2004 -e POSTGRES_DB=telugu_epaper -p 5432:5432 -d postgres:15
```

### 2. Create Database

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `telugu_epaper`

**Option B: Using psql (Command Line)**
```bash
psql -U postgres
CREATE DATABASE telugu_epaper;
\q
```

**Option C: Using Docker**
```bash
docker exec -it telugu-epaper-postgres psql -U postgres -c "CREATE DATABASE telugu_epaper;"
```

## Configuration

Your `.env` file is already configured:
```
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=telugu_epaper
DB_USER=postgres
DB_PASSWORD=Tarun2004
```

## Start the Server

```bash
cd backend
npm run dev
```

The server will automatically:
- Create all required tables (users, papers, breaking_news)
- Create indexes for performance
- Create the default admin user

## Verify Connection

Check the console output for:
```
Connected to PostgreSQL database
Database tables initialized successfully
Default admin user created: admin@teluguepaper.com
```

## Troubleshooting

### Connection Error
- Verify PostgreSQL is running
- Check username/password in `.env`
- Ensure database `telugu_epaper` exists

### Port Already in Use
- Change `DB_PORT` in `.env` to a different port
- Or stop the service using that port

## Migration from SQLite

If you have existing data in SQLite and want to migrate:

1. Export data from SQLite
2. Import into PostgreSQL
3. Or start fresh (recommended for development)

## Key Differences from SQLite

- Boolean values: `true/false` instead of `1/0`
- Date queries: `CURRENT_DATE - INTERVAL '7 days'` instead of `date('now', '-7 days')`
- Auto-increment: `SERIAL` instead of `AUTOINCREMENT`
- Placeholders: `$1, $2` instead of `?` (handled automatically by our query wrapper)
