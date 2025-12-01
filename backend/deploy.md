# 🚀 Deployment Guide

## **Frontend Deployment (Vercel)**

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Telugu E-Paper ready for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/telugu-epaper.git
git push -u origin main
```

### 2. Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set these environment variables:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app/api`

### 3. Deploy Backend to Vercel
1. Create a new Vercel project for the `server` folder
2. Set these environment variables:
   - `NODE_ENV` = `production`
   - `DB_TYPE` = `sqlite`
   - `JWT_SECRET` = `your-secure-jwt-secret`
   - `ADMIN_EMAIL` = `admin@teluguepaper.com`
   - `ADMIN_PASSWORD` = `your-secure-password`
   - `FRONTEND_URL` = `https://your-frontend-url.vercel.app`

## **Admin Credentials**
- Email: `admin@teluguepaper.com`
- Password: `admin123` (Change in production!)

## **Post-Deployment**
1. Update CORS settings with actual domain
2. Change admin credentials
3. Test all functionality
4. Upload sample newspapers for demo