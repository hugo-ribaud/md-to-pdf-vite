# Technical Context: Markdown to PDF Converter

_Version: 1.0_
_Created: 2024-12-19_
_Last Updated: 2024-12-19_

## Technology Stack

### Frontend

- **Framework**: React.js with Vite
- **Package Manager**: Bun (ultra-fast JavaScript runtime and package manager)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui for polished, accessible components
- **File Handling**: React Dropzone for drag-and-drop uploads
- **Form Handling**: React Hook Form for upload forms

### Backend

- **Runtime**: Node.js with Express.js
- **Markdown Parser**: Markdown-it (extensible, supports GFM)
- **PDF Generation**: Puppeteer + HTML/CSS rendering
- **Code Highlighting**: Prism.js for syntax highlighting
- **Math Equations**: KaTeX for fast math rendering

### Development Environment

- **Build Tool**: Vite for fast development and hot reload
- **Package Manager**: Bun for lightning-fast installs and runtime
- **Development Server**: Vite dev server (frontend) + Express (backend)

### Deployment & Infrastructure

- **Hosting**: Vercel (seamless deployment, automatic scaling)
- **File Storage**: Temporary local storage (Phase 1)
- **Future Database**: Supabase (planned for user accounts, file history)
- **Future Storage**: Supabase Storage (planned for persistent file storage)

## Dependencies

### Frontend Dependencies

- react: ^18.2.0 - Core React framework
- vite: ^5.0.0 - Build tool and dev server
- tailwindcss: ^3.3.0 - Utility-first CSS framework
- @radix-ui/react-\* - Shadcn/ui component primitives
- react-dropzone: ^14.2.0 - File upload interface
- react-hook-form: ^7.45.0 - Form handling
- lucide-react: ^0.292.0 - Icon library for Shadcn/ui

### Backend Dependencies

- express: ^4.18.0 - Web application framework
- markdown-it: ^13.0.0 - Markdown parser with GFM support
- puppeteer: ^21.0.0 - PDF generation via headless Chrome
- prismjs: ^1.29.0 - Code syntax highlighting
- katex: ^0.16.0 - Math equation rendering
- cors: ^2.8.0 - Cross-origin resource sharing
- multer: ^1.4.0 - File upload handling

## Technical Constraints

- File size limit: 10MB per Markdown file (initial limit)
- PDF generation timeout: 30 seconds maximum
- Memory usage: Monitor Puppeteer memory consumption
- Browser compatibility: Modern browsers (ES2020+ support)
- Mobile responsive: Tailwind responsive design

## Build and Deployment

### Development Setup

```bash
# Install Bun globally
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development servers
bun run dev        # Frontend (Vite) + Backend (Express)
bun run dev:client # Frontend only
bun run dev:server # Backend only
```

### Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit environment variables
# PORT=3000
# NODE_ENV=development
# MAX_FILE_SIZE=10485760
# PDF_TIMEOUT=30000
```

### Build Process

```bash
bun run build     # Build frontend for production
bun run preview   # Preview production build locally
```

### Deployment Procedure

- **Frontend**: Automatic deployment to Vercel on git push
- **Backend**: Serverless functions on Vercel
- **Environment Variables**: Configured in Vercel dashboard
- **CI/CD**: GitHub integration with Vercel

## Configuration Files

### Frontend Configuration

- **vite.config.ts**: Vite configuration with React plugin, path aliases, proxy setup
- **tsconfig.json**: TypeScript configuration for React development
- **tsconfig.node.json**: TypeScript configuration for Node.js tooling
- **tailwind.config.js**: Tailwind CSS configuration with Shadcn/ui theme
- **postcss.config.js**: PostCSS configuration for Tailwind processing

### Development Tooling

- **.eslintrc.json**: ESLint configuration for TypeScript and React
- **.prettierrc**: Prettier configuration for code formatting
- **package.json**: Root package configuration with workspaces
- **client/package.json**: Frontend dependencies and scripts
- **server/package.json**: Backend dependencies and scripts

### Deployment Configuration

- **vercel.json**: Vercel deployment configuration with serverless functions
- **.gitignore**: Git ignore patterns for Node.js, React, and temporary files
- **env.example**: Environment variables template

## Testing Approach

### Unit Testing

- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest for API testing
- **PDF Testing**: Visual regression testing with Percy or similar

### Integration Testing

- End-to-end conversion testing with sample Markdown files
- File upload and download flow testing
- Error handling and edge case testing

### E2E Testing

- Playwright for complete user journey testing
- Cross-browser compatibility testing
- Performance testing with large files

## Performance Considerations

- **Puppeteer Optimization**: Reuse browser instances, implement connection pooling
- **File Processing**: Stream processing for large files
- **Caching**: Cache frequently converted documents
- **CDN**: Vercel Edge Network for global performance
- **Bundle Optimization**: Vite code splitting and tree shaking

## Development Workflow

### Local Development
1. **Setup**: `bun install` to install all dependencies
2. **Development**: `bun run dev` starts both frontend and backend
3. **Frontend**: Available at `http://localhost:5173`
4. **Backend**: Available at `http://localhost:3000`
5. **Proxy**: API calls from frontend automatically proxy to backend

### Code Quality
- **Linting**: ESLint with TypeScript and React rules
- **Formatting**: Prettier for consistent code style
- **Type Checking**: TypeScript with strict mode enabled
- **Pre-commit**: Automated linting and formatting (future)

### Environment Variables
- **Development**: Use `.env` file for local configuration
- **Production**: Configure in Vercel dashboard
- **Required Variables**: PORT, NODE_ENV, MAX_FILE_SIZE, PDF_TIMEOUT
- **Optional Variables**: DEBUG, LOG_LEVEL, RATE_LIMIT settings

## Future Scaling Plans

- **Database**: Supabase PostgreSQL for user data and conversion history
- **Authentication**: Supabase Auth for user management
- **File Storage**: Supabase Storage for persistent file handling
- **API**: RESTful API endpoints for programmatic access
- **Premium Features**: Advanced styling, batch processing, custom templates

---

_This document describes the technologies used in the project and how they're configured._
