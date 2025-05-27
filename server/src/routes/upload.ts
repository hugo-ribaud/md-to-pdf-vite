import { dirname, join } from 'path';

import { createError } from '../middleware/errorHandler.js';
import express from 'express';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { unlink } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = join(__dirname, '../../../temp');
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split('.').pop() || 'md';
    cb(null, `markdown-${uniqueSuffix}.${extension}`);
  },
});

// File filter to only allow markdown files
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'text/markdown',
    'text/x-markdown',
    'text/plain',
    'application/octet-stream', // Some browsers send this for .md files
  ];

  const allowedExtensions = ['.md', '.markdown', '.txt'];
  const fileExtension = file.originalname.toLowerCase().split('.').pop();

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    allowedExtensions.includes(`.${fileExtension}`)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only Markdown files (.md, .markdown) are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Only one file at a time
  },
});

// Upload handler function
const handleUpload = async (req: any, res: any, next: any) => {
  try {
    if (!req.file) {
      throw createError('No file uploaded', 400);
    }

    // Validate file content (basic check)
    if (req.file.size === 0) {
      // Clean up empty file
      await unlink(req.file.path);
      throw createError('Uploaded file is empty', 400);
    }

    // Return file information
    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: req.file.filename.split('.')[0], // Use filename without extension as ID
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        uploadedAt: new Date().toISOString(),
        path: req.file.path,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Upload endpoint
router.post('/', upload.single('markdown'), handleUpload);

// Get upload status endpoint
router.get('/status/:fileId', async (req: any, res: any, next: any) => {
  try {
    const { fileId } = req.params;

    // In a real application, you might store file metadata in a database
    // For now, we'll just return a simple status
    res.json({
      success: true,
      fileId,
      status: 'uploaded',
      message: 'File is ready for conversion',
    });
  } catch (error) {
    next(error);
  }
});

// Delete uploaded file endpoint
router.delete('/:fileId', async (req: any, res: any, next: any) => {
  try {
    const { fileId } = req.params;

    // Find file in temp directory
    const tempDir = join(__dirname, '../../../temp');
    const filePath = join(tempDir, `${fileId}.md`);

    await unlink(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return next(createError('File not found', 404));
    }
    next(error);
  }
});

export default router;
