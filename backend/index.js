import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import cron from 'node-cron';

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables safely (Render compatible)
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET is NOT set. Add it in Render Environment Variables.');
}

// ✅ Import database configuration
import { initializeDatabase } from './config/db.js';

// ✅ Import Routes
import authRoutes from './routes/auth.js';
import paperRoutes from './routes/papers.js';
import breakingNewsRoutes from './routes/breakingNews.js';
import { cleanupOldPapers } from './services/cleanup.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Helmet Security (Render + PDF iframe safe)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameSrc: [
          "'self'",
          "http://localhost:3000",
          "https://epaper-page.onrender.com",
          "https://epaper-front.onrender.com",
          "https://epaper-1bys-87jk49mvu-vamsi-naidu7s-projects.vercel.app",
          "https://epaper-mauve.vercel.app",
          "https://epaper-7o2a.onrender.com",
          "https://epaper-1bys.vercel.app",
          "https://epaper-1bys-awla4qbc5-vamsi-naidu7s-projects.vercel.app",
          "https://www.abhinavaandhra.com",
          "https://abhinavaandhra.com"
        ],
        frameAncestors: [
          "'self'",
          "http://localhost:3000",
          "https://epaper-page.onrender.com",
          "https://epaper-front.onrender.com",
          "https://epaper-1bys-87jk49mvu-vamsi-naidu7s-projects.vercel.app",
          "https://epaper-mauve.vercel.app",
          "https://epaper-7o2a.onrender.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://epaper-page.onrender.com",
          "https://epaper-front.onrender.com",
          "https://epaper-1bys-87jk49mvu-vamsi-naidu7s-projects.vercel.app",
          "https://epaper-mauve.vercel.app",
          "https://epaper-7o2a.onrender.com"
        ],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"]
      }
    }
  })
);

// ✅ Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// ✅ CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://epapera0.vercel.app',
      'https://epaper-front.onrender.com',
      'https://epaper-1bys-87jk49mvu-vamsi-naidu7s-projects.vercel.app',
      'https://epaper-mauve.vercel.app',
      'https://epaper-1bys.vercel.app',
      'https://epaper-1bys-awla4qbc5-vamsi-naidu7s-projects.vercel.app',
      'https://www.abhinavaandhra.com',
      'https://abhinavaandhra.com',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
  })
);

// ✅ Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
await fs.ensureDir(uploadsDir);

// ✅ Serve uploaded files with proper CORS headers
app.use(
  '/uploads',
  (req, res, next) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://epaper-page.onrender.com',
      'https://epaper-front.onrender.com',
      'https://epaper-1bys-87jk49mvu-vamsi-naidu7s-projects.vercel.app',
      'https://epaper-mauve.vercel.app',
      'https://epaper-1bys.vercel.app',
      'https://epaper-1bys-awla4qbc5-vamsi-naidu7s-projects.vercel.app',
      'https://www.abhinavaandhra.com',
      'https://abhinavaandhra.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(uploadsDir)
);

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/breaking-news', breakingNewsRoutes);

// ✅ Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 50MB.'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only PDF files are allowed.'
    });
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
  });
});

// ✅ Frontend Static Serve (Optional – Safe)
const distPath = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: 'API route not found'
      });
    }

    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });
}

// ✅ Daily Cleanup Cron Job
cron.schedule('0 2 * * *', async () => {
  console.log('🕑 Running daily cleanup...');
  try {
    await cleanupOldPapers();
    console.log('✅ Cleanup completed successfully.');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
});

// ✅ Keep-Alive Cron Job (Prevent Render Free Tier Sleep)
// Pings the server every 14 minutes (Render sleeps after 15 mins of inactivity)
cron.schedule('*/14 * * * *', async () => {
  const healthUrl = process.env.RENDER_EXTERNAL_URL
    ? `${process.env.RENDER_EXTERNAL_URL}/api/health`
    : 'https://epaper-7o2a.onrender.com/api/health';

  console.log(`💓 Sending keep-alive ping to ${healthUrl}...`);
  try {
    const response = await fetch(healthUrl);
    if (response.ok) {
      console.log('✅ Keep-alive ping successful.');
    } else {
      console.error(`⚠️ Keep-alive ping returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Keep-alive ping failed:', error.message);
  }
});

// ✅ Start Server (RENDER SAFE)
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(
        `🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`
      );
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
