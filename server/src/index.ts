import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

import compression from 'compression';
import convertRoutes from './routes/convert.js';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import express from 'express';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import { logger } from './middleware/logger.js';
import rateLimit from 'express-rate-limit';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure temp directory exists
const tempDir = join(__dirname, '../../temp');
if (!existsSync(tempDir)) {
  mkdirSync(tempDir, { recursive: true });
}

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Required for Puppeteer
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-domain.vercel.app']
        : ['http://localhost:5173'],
    credentials: true,
  })
);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/upload', uploadRoutes);
app.use('/api/convert', convertRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Temp directory: ${tempDir}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
