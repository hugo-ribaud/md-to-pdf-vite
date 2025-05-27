# System Patterns: Markdown to PDF Converter

_Version: 1.0_
_Created: 2024-12-19_
_Last Updated: 2024-12-19_

## Architecture Overview

The system follows a **modern web application architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend    │    │   Backend    │    │   PDF Engine  │
│   (React/Vite)│◄──►│   (Express)   │◄──►│   (Puppeteer) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │
│ • File Upload UI     │ • File Processing    │ • HTML Rendering  │
│ • Drag & Drop        │ • Markdown Parsing   │ • PDF Generation  │
│ • Preview Display    │ • API Endpoints      │ • Style Injection │
│ • Download Handler   │ • Error Handling     │ • Asset Handling  │
└─────────────────     └─────────────────     └─────────────────
```

**Architecture Pattern**: **Client-Server with Processing Pipeline**

- **Frontend**: Single Page Application (SPA) handling user interactions
- **Backend**: RESTful API service managing file processing and PDF generation
- **Processing**: Markdown → HTML → Styled HTML → PDF pipeline

## Key Components

### 1. **Frontend Application (React/Vite)**

- **Purpose**: User interface and file handling
- **Responsibilities**:
  - File upload and validation
  - Conversion progress tracking
  - PDF download management
  - Error display and user feedback
  - Responsive design across devices

### 2. **API Server (Express.js)**

- **Purpose**: Backend processing and business logic
- **Responsibilities**:
  - File upload handling (Multer)
  - Markdown parsing and validation
  - Conversion orchestration
  - Error handling and logging
  - Rate limiting and security

### 3. **Markdown Processor (Markdown-it)**

- **Purpose**: Parse Markdown to HTML with extensions
- **Responsibilities**:
  - Standard Markdown parsing
  - GitHub Flavored Markdown support
  - Table rendering
  - Code block syntax highlighting
  - Math equation processing

### 4. **PDF Generator (Puppeteer)**

- **Purpose**: Convert styled HTML to PDF
- **Responsibilities**:
  - HTML rendering in headless browser
  - CSS styling application
  - Image and asset handling
  - PDF formatting and optimization
  - Memory management

### 5. **Style Engine (CSS/Tailwind)**

- **Purpose**: PDF styling and layout
- **Responsibilities**:
  - Typography and spacing
  - Code block styling
  - Table formatting
  - Print-optimized layouts
  - Brand-consistent styling

## Design Patterns in Use

### 1. **Pipeline Pattern** - Conversion Flow

```
Markdown File → Validate → Parse → Style → Render → PDF
```

- **Usage**: Each step in the conversion process is a discrete, testable unit
- **Benefits**: Easy to debug, modify, and extend individual steps

### 2. **Factory Pattern** - PDF Generation

```javascript
const PDFFactory = {
  createBasicPDF: (html) => {
    /* basic styling */
  },
  createStyledPDF: (html, theme) => {
    /* themed styling */
  },
};
```

- **Usage**: Different PDF generation strategies for future premium features
- **Benefits**: Extensible for multiple PDF styles and formats

### 3. **Strategy Pattern** - Markdown Processing

```javascript
const MarkdownStrategies = {
  standard: new StandardMarkdown(),
  github: new GitHubFlavoredMarkdown(),
  extended: new ExtendedMarkdown(),
};
```

- **Usage**: Support different Markdown dialects and extensions
- **Benefits**: Easy to add new Markdown variants

### 4. **Observer Pattern** - Progress Tracking

```javascript
const ConversionProgress = {
  notify: (step, progress) => {
    /* update UI */
  },
};
```

- **Usage**: Real-time conversion progress updates to frontend
- **Benefits**: Better user experience for long conversions

### 5. **Middleware Pattern** - Request Processing

```javascript
app.use(validateFile);
app.use(processMarkdown);
app.use(generatePDF);
app.use(handleDownload);
```

- **Usage**: Express.js middleware chain for request processing
- **Benefits**: Modular, reusable request handling

## Data Flow

### 1. **File Upload Flow**

```
User → Drag/Drop File → Validate → Show Preview → Confirm Upload
```

### 2. **Conversion Flow**

```
File Upload → Express API → Markdown Parser → Style Injection →
Puppeteer Rendering → PDF Generation → Temporary Storage → Download Link
```

### 3. **Error Handling Flow**

```
Error Occurs → Log Error → User-Friendly Message → Recovery Options
```

## Key Technical Decisions

### 1. **Stateless Architecture**

- **Decision**: No server-side sessions, files processed immediately
- **Rationale**: Simplifies deployment, better scalability, no database needed initially
- **Trade-off**: No conversion history until Supabase integration

### 2. **Temporary File Storage**

- **Decision**: Store uploaded files and PDFs temporarily (1 hour TTL)
- **Rationale**: Minimize storage costs, privacy-focused approach
- **Trade-off**: Users must download immediately

### 3. **Puppeteer for PDF Generation**

- **Decision**: Use headless Chrome instead of native PDF libraries
- **Rationale**: Superior CSS support, handles complex layouts, web technologies
- **Trade-off**: Higher memory usage, slower than native libraries

### 4. **Client-Side File Validation**

- **Decision**: Validate file type and size on frontend before upload
- **Rationale**: Better user experience, reduces server load
- **Trade-off**: Still need server-side validation for security

### 5. **Monorepo Structure**

- **Decision**: Single repository with frontend and backend
- **Rationale**: Simplified development, shared types, easier deployment
- **Trade-off**: Potential for larger builds, need good separation

## Component Relationships

### **Frontend ↔ Backend Communication**

```javascript
// File Upload
POST /api/convert
Content-Type: multipart/form-data
Body: { file: markdown_file, options: {...} }

// Download PDF
GET /api/download/:conversionId
Response: PDF file stream
```

### **Backend Internal Flow**

```javascript
FileUpload → MarkdownProcessor → StyleEngine → PDFGenerator → FileResponse
     ↓              ↓              ↓           ↓
ErrorHandler ← ErrorHandler ← ErrorHandler ← ErrorHandler
```

### **Error Propagation**

```javascript
Component Error → Express Error Handler → Structured Response → Frontend Display
```

## Scalability Considerations

### **Horizontal Scaling** (Future)

- Stateless design enables multiple server instances
- Vercel serverless functions auto-scale
- Supabase handles database scaling

### **Performance Optimization**

- Puppeteer instance pooling
- PDF caching for identical inputs
- CDN for static assets
- Code splitting for frontend

### **Memory Management**

- Monitor Puppeteer browser instances
- Implement timeout mechanisms
- Clean up temporary files
- Set file size limits

---

_This document captures the system architecture and design patterns used in the project._
