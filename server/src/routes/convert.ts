import { dirname, join } from 'path';
import express, { NextFunction, Request, Response } from 'express';

import { createError } from '../middleware/errorHandler.js';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import puppeteer from 'puppeteer';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure marked for better HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
});

// HTML template for PDF generation
const getHtmlTemplate = (
  content: string,
  title: string = 'Markdown Document'
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: white;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        h1 { font-size: 2.5rem; border-bottom: 3px solid #3498db; padding-bottom: 0.5rem; }
        h2 { font-size: 2rem; border-bottom: 2px solid #ecf0f1; padding-bottom: 0.3rem; }
        h3 { font-size: 1.5rem; }
        p { margin-bottom: 1rem; }
        code {
            background: #f8f9fa;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.9rem;
        }
        pre {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 5px;
            overflow-x: auto;
            border-left: 4px solid #3498db;
        }
        pre code {
            background: none;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #bdc3c7;
            margin: 1rem 0;
            padding-left: 1rem;
            color: #7f8c8d;
            font-style: italic;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 0.75rem;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        ul, ol {
            margin-bottom: 1rem;
            padding-left: 2rem;
        }
        li {
            margin-bottom: 0.5rem;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        @media print {
            body { margin: 0; padding: 1rem; }
            h1 { page-break-before: avoid; }
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;

// Convert markdown to PDF
router.post(
  '/:fileId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params;
      const { title, options = {} } = req.body;

      // Find the uploaded file
      const tempDir = join(__dirname, '../../../temp');
      const markdownPath = join(tempDir, `${fileId}.md`);

      // Read markdown file
      let markdownContent: string;
      try {
        markdownContent = await readFile(markdownPath, 'utf-8');
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          throw createError(
            'File not found. Please upload the file first.',
            404
          );
        }
        throw error;
      }

      // Convert markdown to HTML
      const htmlContent = marked(markdownContent);
      const fullHtml = getHtmlTemplate(
        htmlContent,
        title || 'Markdown Document'
      );

      // Generate PDF using Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      try {
        const page = await browser.newPage();
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        // PDF options
        const pdfOptions = {
          format: 'A4' as const,
          printBackground: true,
          margin: {
            top: '1in',
            right: '1in',
            bottom: '1in',
            left: '1in',
          },
          ...options,
        };

        const pdfBuffer = await page.pdf(pdfOptions);

        // Set response headers for PDF download
        const filename = title
          ? `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`
          : `markdown_${fileId}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`
        );
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send PDF
        res.send(pdfBuffer);
      } finally {
        await browser.close();
      }
    } catch (error) {
      next(error);
    }
  }
);

// Get conversion status
router.get(
  '/status/:fileId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params;

      // Check if file exists
      const tempDir = join(__dirname, '../../../temp');
      const markdownPath = join(tempDir, `${fileId}.md`);

      try {
        await readFile(markdownPath);
        res.json({
          success: true,
          fileId,
          status: 'ready',
          message: 'File is ready for conversion',
        });
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          throw createError('File not found', 404);
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }
);

// Preview markdown as HTML
router.get(
  '/preview/:fileId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params;

      // Find the uploaded file
      const tempDir = join(__dirname, '../../../temp');
      const markdownPath = join(tempDir, `${fileId}.md`);

      // Read markdown file
      let markdownContent: string;
      try {
        markdownContent = await readFile(markdownPath, 'utf-8');
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          throw createError('File not found', 404);
        }
        throw error;
      }

      // Convert markdown to HTML
      const htmlContent = marked(markdownContent);
      const fullHtml = getHtmlTemplate(htmlContent, 'Preview');

      res.setHeader('Content-Type', 'text/html');
      res.send(fullHtml);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
