# 🚀 Quick Deployment Checklist

## Before Deployment

- [ ] Push code to GitHub
- [ ] Test locally (both frontend and backend)
- [ ] Update `.gitignore` to exclude `.env`, `node_modules`, `uploads`, `data`
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Choose strong admin password

## Render - PostgreSQL Database

- [ ] Create PostgreSQL database on Render
- [ ] Save database credentials (host, user, password, database name)
- [ ] Note the Internal Database URL

## Render - Backend Service

- [ ] Create Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add all environment variables:
  - [ ] DB_TYPE=postgres
  - [ ] DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
  - [ ] JWT_SECRET
  - [ ] NODE_ENV=production
  - [ ] ADMIN_EMAIL, ADMIN_PASSWORD
  - [ ] FRONTEND_URL (add after frontend deployment)
- [ ] Deploy and wait for build
- [ ] Copy backend URL (e.g., https://your-app.onrender.com)

## Vercel - Frontend

- [ ] Create new project on Vercel
- [ ] Connect GitHub repository
- [ ] Set Root Directory: `frontend`
- [ ] Framework: Vite
- [ ] Add environment variable:
  - [ ] VITE_API_URL=https://your-backend.onrender.com/api
- [ ] Deploy
- [ ] Copy frontend URL

## Final Steps

- [ ] Update backend FRONTEND_URL with Vercel URL
- [ ] Redeploy backend on Render
- [ ] Test login at https://your-app.vercel.app/admin
- [ ] Upload a test paper
- [ ] Verify paper shows on homepage
- [ ] Check PDF loads correctly

## File Storage (Choose One)

- [ ] Option A: Set up Cloudinary (recommended)
- [ ] Option B: Set up AWS S3
- [ ] Option C: Add Render persistent disk (paid)

## Security

- [ ] Changed default admin password ✓
- [ ] Using strong JWT_SECRET ✓
- [ ] HTTPS enabled (automatic) ✓
- [ ] Environment variables secured ✓

## Optional

- [ ] Set up custom domain
- [ ] Configure monitoring/alerts
- [ ] Set up database backups
- [ ] Add analytics

---

## Quick Reference

### Backend URL Format
```
https://your-backend-name.onrender.com
```

### Frontend URL Format
```
https://your-app-name.vercel.app
```

### Environment Variables Summary

**Backend (Render)**:
```
DB_TYPE=postgres
DB_HOST=<from-render-postgres>
DB_PORT=5432
DB_NAME=telugu_epaper
DB_USER=<from-render-postgres>
DB_PASSWORD=<from-render-postgres>
JWT_SECRET=<32-char-random-string>
NODE_ENV=production
ADMIN_EMAIL=admin@teluguepaper.com
ADMIN_PASSWORD=<strong-password>
FRONTEND_URL=<vercel-url>
```

**Frontend (Vercel)**:
```
VITE_API_URL=<render-backend-url>/api
```

---

## Testing Commands

Test backend health:
```bash
curl https://your-backend.onrender.com/api/health
```

Test frontend:
```
Open: https://your-app.vercel.app
```

---

## Common Issues

**Backend sleeps (Free tier)**
- First request takes 30-60 seconds
- Upgrade to paid tier for always-on

**Files disappear after restart**
- Set up Cloudinary or S3
- Render filesystem is ephemeral

**CORS errors**
- Check FRONTEND_URL is set correctly
- Verify VITE_API_URL matches backend URL

**Database connection fails**
- Verify all DB credentials
- Check database is running
- Use Internal Database URL on Render
