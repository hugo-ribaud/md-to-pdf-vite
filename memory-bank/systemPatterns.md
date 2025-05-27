# System Patterns: Markdown to PDF Converter

_Version: 1.1_
_Created: 2024-12-19_
_Last Updated: 2024-12-19_

## Architecture Overview

The system follows a **modern web application architecture** with clear separation of concerns and dual conversion modes:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend    │    │   Backend    │    │   PDF Engine  │
│   (React/Vite)│◄──►│   (Express)   │◄──►│   (Puppeteer) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │
│ • File Upload UI     │ • File Processing    │ • HTML Rendering  │
│ • Live Editor        │ • Markdown Parsing   │ • PDF Generation  │
│ • Real-time Preview  │ • API Endpoints      │ • Style Injection │
│ • Mode Toggle        │ • Error Handling     │ • Asset Handling  │
│ • Dark Mode          │ • Live Preview API   │ • Memory Cleanup  │
└─────────────────     └─────────────────     └─────────────────
```

**Architecture Pattern**: **Dual-Mode Client-Server with Processing Pipeline**

- **Frontend**: Single Page Application (SPA) with two conversion modes
- **Backend**: RESTful API service with file-based and live content processing
- **Processing**: Markdown → HTML → Styled HTML → PDF pipeline (optimized for both modes)

## Key Components

### 1. **Frontend Application (React/Vite)**

- **Purpose**: User interface with dual conversion modes
- **Responsibilities**:
  - Mode toggle between file upload and live editor
  - File upload and validation (upload mode)
  - Live Markdown editing with Monaco Editor (editor mode)
  - Real-time PDF preview with debouncing
  - Dark mode toggle for preview
  - Responsive design across devices
  - Error display and user feedback

### 2. **Live Editor System (Monaco Editor)**

- **Purpose**: Professional Markdown editing experience
- **Responsibilities**:
  - Syntax highlighting for Markdown
  - Auto-completion and bracket matching
  - Line numbers and code folding
  - Fullscreen editing mode
  - Character counting
  - Sample content loading

### 3. **Real-time Preview System**

- **Purpose**: Live PDF preview with optimal performance
- **Responsibilities**:
  - Debounced API calls (500ms delay)
  - Clean PDF display (hidden browser navigation)
  - Dark mode toggle for comfortable viewing
  - Download integration
  - Error handling and retry mechanisms
  - Memory management for blob URLs

### 4. **API Server (Express.js)**

- **Purpose**: Backend processing with dual endpoints
- **Responsibilities**:
  - File upload handling (Multer) - `/api/upload`
  - File-based conversion - `/api/convert/:fileId`
  - Live content conversion - `/api/convert/preview`
  - Error handling and logging
  - Rate limiting and security
  - Browser instance management

### 5. **Markdown Processor (Markdown-it)**

- **Purpose**: Parse Markdown to HTML with extensions
- **Responsibilities**:
  - Standard Markdown parsing
  - GitHub Flavored Markdown support
  - Table rendering
  - Code block syntax highlighting
  - Math equation processing
  - Consistent output for both modes

### 6. **PDF Generator (Puppeteer)**

- **Purpose**: Convert styled HTML to PDF with optimization
- **Responsibilities**:
  - HTML rendering in headless browser
  - CSS styling application
  - Image and asset handling
  - PDF formatting and optimization
  - Memory management and cleanup
  - Performance optimization for live preview

## Design Patterns in Use

### 1. **Mode Strategy Pattern** - Dual Conversion Modes

```javascript
const ConversionModes = {
  upload: {
    component: FileUpload,
    workflow: 'file → upload → convert → download',
  },
  editor: {
    component: EditorPanel,
    workflow: 'type → preview → download',
  },
};
```

- **Usage**: Switch between file upload and live editor modes
- **Benefits**: Clean separation of concerns, extensible for future modes

### 2. **Pipeline Pattern** - Conversion Flow

```
File Upload Mode: File → Validate → Store → Parse → Style → Render → PDF
Live Editor Mode: Content → Debounce → Parse → Style → Render → PDF
```

- **Usage**: Each step in the conversion process is discrete and testable
- **Benefits**: Easy to debug, modify, and extend individual steps

### 3. **Observer Pattern** - Real-time Updates

```javascript
const LivePreview = {
  debounce: 500,
  onChange: content => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => generatePreview(content), 500);
  },
};
```

- **Usage**: Real-time preview updates with performance optimization
- **Benefits**: Smooth user experience without overwhelming the server

### 4. **Factory Pattern** - PDF Generation

```javascript
const PDFFactory = {
  createFromFile: (fileId, options) => {
    /* file-based PDF generation */
  },
  createFromContent: (content, options) => {
    /* live content PDF generation */
  },
};
```

- **Usage**: Different PDF generation strategies for file vs. live content
- **Benefits**: Optimized performance for each use case

### 5. **State Management Pattern** - Mode and Theme State

```javascript
const AppState = {
  mode: 'upload' | 'editor',
  theme: 'light' | 'dark',
  editorState: { content, title, isFullscreen },
  previewState: { isLoading, error, pdfUrl },
};
```

- **Usage**: Centralized state management for UI modes and preferences
- **Benefits**: Consistent state across components, easy debugging

## Data Flow

### 1. **File Upload Flow**

```
User → Drag/Drop File → Validate → Upload → Store → Convert → Download
```

### 2. **Live Editor Flow**

```
User → Type Content → Debounce → API Call → Generate PDF → Display Preview
```

### 3. **Mode Switching Flow**

```
User → Toggle Mode → Reset State → Load New Interface → Ready for Input
```

### 4. **Dark Mode Flow**

```
User → Toggle Dark Mode → Update Preview Theme → Apply Styling → Smooth Transition
```

## Key Technical Decisions

### 1. **Dual-Mode Architecture**

- **Decision**: Support both file upload and live editor modes
- **Rationale**: Caters to different user workflows and preferences
- **Trade-off**: Increased complexity but significantly better user experience

### 2. **Monaco Editor Integration**

- **Decision**: Use Monaco Editor for live editing
- **Rationale**: Professional-grade editor with excellent Markdown support
- **Trade-off**: Larger bundle size but superior editing experience

### 3. **Debounced Live Preview**

- **Decision**: 500ms debounce for live preview API calls
- **Rationale**: Balance between responsiveness and server load
- **Trade-off**: Slight delay but prevents excessive API calls

### 4. **Clean PDF Display**

- **Decision**: Hide browser PDF navigation using URL parameters
- **Rationale**: Better user experience and more space for content
- **Trade-off**: Browser-dependent but works across major browsers

### 5. **Dark Mode for Preview**

- **Decision**: Add dark mode toggle specifically for PDF preview
- **Rationale**: Reduces eye strain during long editing sessions
- **Trade-off**: Additional complexity but significant UX improvement

## Component Relationships

### **Mode Toggle System**

```javascript
App → ModeToggle → {
  upload: FileUpload → ConversionPanel,
  editor: EditorPanel → MarkdownEditor + PDFPreview
}
```

### **Live Editor Communication**

```javascript
EditorPanel → {
  MarkdownEditor: onChange(content),
  PDFPreview: generatePreview(content, title)
}
```

### **API Endpoint Structure**

```javascript
// File-based conversion
POST /api/upload → store file
POST /api/convert/:fileId → generate PDF from file

// Live content conversion
POST /api/convert/preview → generate PDF from content
```

## Performance Optimizations

### **Live Preview Optimizations**

- Debounced API calls to prevent server overload
- Blob URL management with proper cleanup
- Optimized Puppeteer settings for faster generation
- Content size limits (1MB) for live preview

### **Memory Management**

- Automatic browser instance cleanup
- Blob URL revocation on component unmount
- Efficient state updates with React hooks
- Optimized re-renders with proper dependencies

### **User Experience Optimizations**

- Smooth transitions between modes and themes
- Loading states and error handling
- Responsive design for all screen sizes
- Keyboard shortcuts and accessibility features

## Scalability Considerations

### **Horizontal Scaling** (Future)

- Stateless design enables multiple server instances
- Vercel serverless functions auto-scale
- Browser instance pooling for production

### **Performance Monitoring**

- Track conversion times and memory usage
- Monitor API response times
- User experience metrics collection
- Error rate monitoring

---

_This document captures the enhanced system architecture including the live editor feature and dual-mode conversion system._
