# Render Environment Variables

Copy these exact values to your Render backend service:

## Database Configuration

```
DB_TYPE=postgres
DB_HOST=dpg-d4pu09shg0os73fucfng-a
DB_PORT=5432
DB_NAME=telugu_epaper
DB_USER=telugu_epaper_user
DB_PASSWORD=Oe3kWeFMrm9qPqZvVSDonfk9wSsURfcz
```

## JWT Configuration

```
JWT_SECRET=8f3a9b2c7e1d4f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
JWT_EXPIRES_IN=7d
```

## Server Configuration

```
PORT=5000
NODE_ENV=production
```

## Admin Credentials

```
ADMIN_EMAIL=admin@teluguepaper.com
ADMIN_PASSWORD=admin123
```

⚠️ **IMPORTANT**: Change `ADMIN_PASSWORD` to something secure before deploying!

## File Upload Configuration

```
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=application/pdf
```

## CORS Configuration

```
FRONTEND_URL=https://your-app.vercel.app
```

⚠️ **UPDATE THIS**: Replace with your actual Vercel URL after frontend deployment

---

## How to Add These on Render

1. Go to your backend service on Render
2. Click **Environment** tab
3. Click **Add Environment Variable**
4. Copy-paste each variable name and value
5. Click **Save Changes**
6. Service will automatically redeploy

---

## Alternative: Use Database URL Directly

If you prefer, you can use the full database URL:

```
DATABASE_URL=postgresql://telugu_epaper_user:Oe3kWeFMrm9qPqZvVSDonfk9wSsURfcz@dpg-d4pu09shg0os73fucfng-a/telugu_epaper
```

But you'll need to update `backend/config/database.js` to parse this URL.

The individual variables approach (shown above) works with your current code without any changes.
