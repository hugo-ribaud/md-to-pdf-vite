# Markdown to PDF Converter

An online web application that converts Markdown files to well-formatted PDF documents. Built with React, Express.js, and Puppeteer.

## Features

- ✅ **Multiple Markdown Formats**: Standard Markdown, GitHub Flavored Markdown
- ✅ **Rich Content Support**: Tables, code highlighting, math equations, embedded images
- ✅ **Modern Web Interface**: Drag & drop file upload with real-time preview
- ✅ **Professional PDF Output**: Clean, well-formatted PDF generation
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Fast Performance**: Built with Vite and Bun for lightning-fast development

## Tech Stack

### Frontend
- **React 18** with **Vite** for fast development
- **Tailwind CSS** for modern styling
- **Shadcn/ui** for polished UI components
- **React Dropzone** for file upload handling

### Backend
- **Express.js** for API server
- **Markdown-it** for comprehensive Markdown parsing
- **Puppeteer** for high-quality PDF generation
- **Prism.js** for syntax highlighting
- **KaTeX** for math equation rendering

### Development
- **Bun** for ultra-fast package management
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality

## Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (v1.0.0 or higher)
- Node.js (v18.0.0 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd markdown-to-pdf-converter
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start development servers**
   ```bash
   bun run dev
   ```

This will start:
- Frontend dev server at `http://localhost:5173`
- Backend API server at `http://localhost:3000`

### Building for Production

```bash
# Build both client and server
bun run build

# Preview the production build
bun run preview
```

## Project Structure

```
markdown-to-pdf-converter/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── styles/         # CSS and styling
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Express.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Server utilities
│   ├── temp/               # Temporary file storage
│   └── package.json
├── shared/                 # Shared types and utilities
├── docs/                   # Documentation
├── memory-bank/            # Project intelligence files
└── package.json            # Root package configuration
```

## API Endpoints

### `POST /api/convert`
Convert a Markdown file to PDF

**Request:**
- `Content-Type: multipart/form-data`
- `file`: Markdown file to convert
- `options`: Conversion options (optional)

**Response:**
- `200`: Returns conversion ID for download
- `400`: Invalid file or request
- `500`: Server error

### `GET /api/download/:conversionId`
Download the generated PDF

**Response:**
- `200`: PDF file stream
- `404`: Conversion not found or expired

## Development

### Available Scripts

```bash
# Development
bun run dev              # Start both client and server in development mode
bun run dev:client       # Start only the frontend development server
bun run dev:server       # Start only the backend development server

# Building
bun run build            # Build both client and server for production
bun run build:client     # Build only the frontend
bun run build:server     # Build only the backend

# Testing
bun test                 # Run all tests
bun run test:watch       # Run tests in watch mode

# Code Quality
bun run lint             # Lint all code
bun run lint:fix         # Fix linting issues automatically

# Utilities
bun run clean            # Clean build artifacts and caches
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_TIMEOUT=30000    # 30 seconds

# PDF Generation
PDF_TIMEOUT=30000       # 30 seconds
TEMP_FILE_TTL=3600      # 1 hour in seconds
```

## Deployment

This project is optimized for deployment on **Vercel**:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Vercel Configuration

The project includes `vercel.json` configuration for seamless deployment with serverless functions.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

### Phase 1 (Current) - MVP
- [x] Basic Markdown to PDF conversion
- [x] File upload interface
- [x] GitHub Flavored Markdown support
- [x] Code syntax highlighting
- [x] Math equation rendering

### Phase 2 - Enhancements
- [ ] Advanced PDF styling options
- [ ] Batch file processing
- [ ] Custom CSS themes
- [ ] Print layout optimization

### Phase 3 - Scaling
- [ ] User accounts and history
- [ ] API endpoints for developers
- [ ] Premium features and monetization
- [ ] Performance optimizations

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/your-username/markdown-to-pdf-converter/issues) on GitHub.

---

Built with ❤️ using React, Express.js, and Puppeteer 