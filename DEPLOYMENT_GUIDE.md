# Deployment Guide - Telugu E-Paper

## 🚀 Deploying to Render.com

### Step 1: Prepare Your Repository

1. Push your code to GitHub
2. Make sure `.gitignore` excludes:
   - `node_modules/`
   - `.env`
   - `backend/data/` (SQLite database)
   - `backend/uploads/` (uploaded files)

### Step 2: Deploy PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `telugu-epaper-db`
   - **Database**: `telugu_epaper`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free or Starter
4. Click **Create Database**
5. **Save these credentials** (you'll need them):
   - Internal Database URL
   - External Database URL
   - PSQL Command

### Step 3: Deploy Backend on Render

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `telugu-epaper-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter

4. **Add Environment Variables**:
   ```
   DB_TYPE=postgres
   DB_HOST=<from PostgreSQL internal URL>
   DB_PORT=5432
   DB_NAME=telugu_epaper
   DB_USER=<from PostgreSQL credentials>
   DB_PASSWORD=<from PostgreSQL credentials>
   
   JWT_SECRET=<generate a strong random string>
   JWT_EXPIRES_IN=7d
   
   PORT=5000
   NODE_ENV=production
   
   ADMIN_EMAIL=admin@teluguepaper.com
   ADMIN_PASSWORD=<choose a strong password>
   
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=52428800
   ALLOWED_FILE_TYPES=application/pdf
   
   FRONTEND_URL=<will add after frontend deployment>
   ```

5. Click **Create Web Service**

### Step 4: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable**:
   ```
   VITE_API_URL=https://telugu-epaper-backend.onrender.com/api
   ```
   (Replace with your actual Render backend URL)

6. Click **Deploy**

### Step 5: Update Backend with Frontend URL

1. Go back to Render backend service
2. Update environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Save and redeploy

### Step 6: Configure File Storage (Important!)

⚠️ **Render's filesystem is ephemeral** - uploaded files will be deleted on restart!

**Option A: Use Cloudinary (Recommended)**

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials
3. Add to backend `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Update upload middleware to use Cloudinary

**Option B: Use AWS S3**

1. Create S3 bucket
2. Add credentials to `.env`
3. Update upload middleware

**Option C: Use Render Disk (Paid)**

1. Add persistent disk to your Render service
2. Mount at `/uploads`

---

## 📝 Files to Update for Production

### 1. Backend `.env` (on Render)
```env
DB_TYPE=postgres
DB_HOST=<render-postgres-host>
DB_PORT=5432
DB_NAME=telugu_epaper
DB_USER=<render-postgres-user>
DB_PASSWORD=<render-postgres-password>

JWT_SECRET=<strong-random-string-min-32-chars>
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=production

ADMIN_EMAIL=admin@teluguepaper.com
ADMIN_PASSWORD=<strong-password>

UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=application/pdf

FRONTEND_URL=https://your-app.vercel.app
```

### 2. Frontend `.env` (on Vercel)
```env
VITE_API_URL=https://telugu-epaper-backend.onrender.com/api
```

### 3. Update `backend/index.js` CORS origins
Already configured! Just make sure `FRONTEND_URL` env var is set.

### 4. Update `frontend/vite.config.ts`
Remove the proxy (only needed for local development):
```typescript
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        historyApiFallback: true,
        // Remove proxy in production
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

---

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Set NODE_ENV=production
- [ ] Don't commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting (already configured)
- [ ] Set up database backups

---

## 🧪 Testing Production Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK",...}`

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try logging in at `/admin`
   - Upload a test paper
   - View paper on homepage

3. **Test Database**:
   - Check if papers persist after backend restart
   - Verify admin user exists

---

## 📊 Monitoring

### Render
- View logs in Render dashboard
- Set up alerts for downtime
- Monitor database usage

### Vercel
- View deployment logs
- Check analytics
- Monitor bandwidth usage

---

## 🔄 Updating Your App

### Backend Updates
1. Push changes to GitHub
2. Render auto-deploys from `main` branch
3. Check logs for errors

### Frontend Updates
1. Push changes to GitHub
2. Vercel auto-deploys
3. Check deployment status

---

## 💰 Cost Estimate

### Free Tier (Good for testing)
- **Render PostgreSQL**: Free (1GB storage, sleeps after inactivity)
- **Render Web Service**: Free (512MB RAM, sleeps after 15min inactivity)
- **Vercel**: Free (100GB bandwidth/month)
- **Total**: $0/month

### Starter Tier (Recommended for production)
- **Render PostgreSQL**: $7/month (256MB RAM, always on)
- **Render Web Service**: $7/month (512MB RAM, always on)
- **Vercel Pro**: $20/month (1TB bandwidth)
- **Cloudinary**: Free tier (25GB storage, 25GB bandwidth)
- **Total**: ~$14-34/month

---

## 🆘 Troubleshooting

### Backend won't start
- Check environment variables are set
- Verify database connection string
- Check Render logs

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS settings
- Ensure backend is running

### Files not persisting
- Set up Cloudinary or S3
- Or use Render persistent disk

### Database connection errors
- Check DB credentials
- Verify database is running
- Check IP whitelist (if applicable)

---

## 📞 Support

If you encounter issues:
1. Check Render/Vercel logs
2. Verify all environment variables
3. Test API endpoints directly
4. Check database connectivity

---

## 🎉 You're Done!

Your Telugu E-Paper website is now live and accessible worldwide!

**Next Steps**:
- Set up custom domain
- Configure SSL certificate (automatic)
- Set up monitoring and alerts
- Plan for scaling
