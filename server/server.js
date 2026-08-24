import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. High-Performance Gzip Compression Middleware
app.use(compression({
  threshold: 1024, // Only compress responses above 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// 2. Enable CORS for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Serve Uploaded Media & Audios statically with full Range support for mobile playback & caching
const staticUploadOptions = {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    if (filePath.endsWith('.webm')) res.setHeader('Content-Type', 'audio/webm');
    else if (filePath.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');
    else if (filePath.endsWith('.m4a') || filePath.endsWith('.aac')) res.setHeader('Content-Type', 'audio/mp4');
    else if (filePath.endsWith('.wav')) res.setHeader('Content-Type', 'audio/wav');
    else if (filePath.endsWith('.ogg')) res.setHeader('Content-Type', 'audio/ogg');
  }
};

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), staticUploadOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticUploadOptions));

// 5. Serve built frontend assets in production with aggressive caching
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  // Hashed static assets (JS chunks, CSS, SVG, images) cached for 1 year immutable
  const distAssetsPath = path.join(distPath, 'assets');
  if (fs.existsSync(distAssetsPath)) {
    app.use('/assets', express.static(distAssetsPath, {
      maxAge: '1y',
      immutable: true
    }));
  }

  // Root dist static files
  app.use(express.static(distPath, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
}

// 6. Health Check & Keep-Alive Ping Endpoint (for UptimeRobot / Cron / Internal Warm-up)
app.get('/api/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).json({
    status: 'ok',
    system: 'MoTDAR E-Learning Engine',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 7. API Routes
app.use('/api', apiRoutes);

// 8. SPA Fallback for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.sendFile(indexPath);
  }
  res.json({
    status: 'ONLINE',
    system: 'MoTDAR National E-Learning Enterprise Backend API',
    version: '2.0.0'
  });
});

// 9. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({ error: err.message || 'Server encountered an unexpected error.' });
});

// 10. Auto Keep-Alive Dyno Warmer for Render & Cloud Hosting (Prevents free-tier sleep)
const startKeepAlive = () => {
  const externalUrl = process.env.RENDER_EXTERNAL_URL || process.env.HOSTING_URL || process.env.APP_URL;
  if (externalUrl) {
    const cleanUrl = externalUrl.replace(/\/$/, '');
    console.log(`⏱️ Initializing Auto Keep-Alive Dyno Warmer for: ${cleanUrl}`);
    // Ping every 12 minutes (720,000 ms) to keep Render Free Dyno active
    setInterval(async () => {
      try {
        const response = await fetch(`${cleanUrl}/api/health`);
        if (response.ok) {
          console.log(`[Keep-Alive Ping]: Dyno is warm and active (${new Date().toLocaleTimeString()})`);
        }
      } catch (pingErr) {
        console.warn(`[Keep-Alive Notice]: ${pingErr.message}`);
      }
    }, 12 * 60 * 1000);
  }
};

app.listen(PORT, () => {
  console.log(`🚀 MoTDAR E-Learning API Server running at http://localhost:${PORT}`);
  console.log(`📁 Uploads available at http://localhost:${PORT}/uploads/avatars`);
  startKeepAlive();
});
