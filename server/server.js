import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

import fs from 'fs';

// Serve Uploaded Student Profile Pictures statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve built frontend assets in production if dist directory exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// API Routes
app.use('/api', apiRoutes);

// SPA Fallback for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    status: 'ONLINE',
    system: 'MoTDAR National E-Learning Enterprise Backend API',
    version: '2.0.0'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({ error: err.message || 'Server encountered an unexpected error.' });
});

app.listen(PORT, () => {
  console.log(`🚀 MoTDAR E-Learning API Server running at http://localhost:${PORT}`);
  console.log(`📁 Uploads available at http://localhost:${PORT}/uploads/avatars`);
});
