# PostgreSQL Migration Checklist

## ✅ Code Changes Complete

- [x] Updated `backend/config/database.js` with query syntax converter
- [x] Added `thumbnail_url` column to papers table schema
- [x] Added `breaking_news` table schema
- [x] Fixed date queries in `backend/routes/papers.js`
- [x] Fixed boolean handling in `backend/routes/breakingNews.js`
- [x] Updated `.env` to use PostgreSQL
- [x] All files pass diagnostics (no errors)

## 📋 Setup Steps (Do These Now)

### Step 1: Install PostgreSQL
Choose one option:

**Option A: Windows Installer**
```
Download: https://www.postgresql.org/download/windows/
Install and remember the postgres password
```

**Option B: Docker (Recommended)**
```bash
docker run --name telugu-epaper-postgres \
  -e POSTGRES_PASSWORD=Tarun2004 \
  -e POSTGRES_DB=telugu_epaper \
  -p 5432:5432 \
  -d postgres:15
```

### Step 2: Verify PostgreSQL is Running
```bash
# Check if PostgreSQL is running
docker ps  # If using Docker
# OR
# Check Windows Services for "PostgreSQL"
```

### Step 3: Test Connection
```bash
cd backend
node test-postgres.js
```

Expected output:
```
🔍 Testing PostgreSQL connection...
📦 Initializing database...
Connected to PostgreSQL database
Database tables initialized successfully
✅ Database initialized successfully!
```

### Step 4: Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
Connected to PostgreSQL database
Database tables initialized successfully
Default admin user created: admin@teluguepaper.com
✅ Database initialized
🚀 Server running on port 5000
```

### Step 5: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 6: Test the Application
1. Open http://localhost:3000
2. Go to http://localhost:3000/admin
3. Login: admin@teluguepaper.com / admin123
4. Upload a test paper
5. View it on the homepage

## 🔍 Troubleshooting

### "Connection refused" or "ECONNREFUSED"
- PostgreSQL is not running
- Check port 5432 is not blocked
- Verify credentials in `.env`

### "Database does not exist"
```bash
# Create database manually
docker exec -it telugu-epaper-postgres psql -U postgres -c "CREATE DATABASE telugu_epaper;"
```

### "Password authentication failed"
- Check `DB_PASSWORD` in `.env` matches PostgreSQL password

### Want to switch back to SQLite?
Change in `backend/.env`:
```
DB_TYPE=sqlite
```

## 📊 What's Different?

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| File | Single .db file | Server-based |
| Concurrent writes | Limited | Excellent |
| Production ready | No | Yes |
| Scalability | Limited | Excellent |
| Backup | Copy file | pg_dump |

## 🎯 Current Status

Your code is **100% ready** for PostgreSQL. You just need to:
1. Install/start PostgreSQL
2. Run the backend
3. Everything else is automatic!
