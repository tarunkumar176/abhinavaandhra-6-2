# Fix Render Database Connection

## The Problem
Your database URL is missing the full hostname. Render PostgreSQL needs the complete internal hostname.

## Solution

### Get the Correct Hostname

1. Go to your Render Dashboard
2. Click on your PostgreSQL database
3. Look for **Internal Database URL** or **Connections**
4. You'll see something like:
   ```
   postgresql://telugu_epaper_user:Oe3kWeFMrm9qPqZvVSDonfk9wSsURfcz@dpg-d4pu09shg0os73fucfng-a.oregon-postgres.render.com:5432/telugu_epaper
   ```

### Update Environment Variables

The hostname should be the FULL hostname with region:

```
DB_HOST=dpg-d4pu09shg0os73fucfng-a.oregon-postgres.render.com
```

NOT just:
```
DB_HOST=dpg-d4pu09shg0os73fucfng-a
```

### Complete Environment Variables

Update these on Render:

```
DB_TYPE=postgres
DB_HOST=dpg-d4pu09shg0os73fucfng-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=telugu_epaper
DB_USER=telugu_epaper_user
DB_PASSWORD=Oe3kWeFMrm9qPqZvVSDonfk9wSsURfcz

JWT_SECRET=8f3a9b2c7e1d4f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=production

ADMIN_EMAIL=admin@teluguepaper.com
ADMIN_PASSWORD=YourSecurePassword123!

UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=application/pdf

FRONTEND_URL=https://your-app.vercel.app
```

### Alternative: Use DATABASE_URL

Or use the full connection string as a single variable:

1. Add this environment variable on Render:
   ```
   DATABASE_URL=postgresql://telugu_epaper_user:Oe3kWeFMrm9qPqZvVSDonfk9wSsURfcz@dpg-d4pu09shg0os73fucfng-a.oregon-postgres.render.com:5432/telugu_epaper
   ```

2. Update `backend/config/database.js` to use it:
   ```javascript
   export const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: {
       rejectUnauthorized: false
     }
   });
   ```

## Steps to Fix

1. Go to Render Dashboard → Your PostgreSQL Database
2. Copy the **Internal Database URL** (full URL with region)
3. Extract the hostname (the part between @ and :5432)
4. Update `DB_HOST` environment variable with the FULL hostname
5. Save and redeploy

The hostname format is usually:
```
dpg-XXXXX-a.[region]-postgres.render.com
```

Where `[region]` might be:
- `oregon`
- `frankfurt`
- `singapore`
- `ohio`
- etc.
