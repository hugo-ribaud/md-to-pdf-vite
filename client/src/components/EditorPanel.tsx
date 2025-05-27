import React, { useState } from 'react';

import { MarkdownEditor } from './MarkdownEditor';
import { PDFPreview } from './PDFPreview';

interface EditorPanelProps {
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  onReset: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  onError,
  onSuccess,
  onReset,
}) => {
  const [markdownContent, setMarkdownContent] =
    useState(`# Welcome to the Live Markdown Editor!

This is a **live editor** with instant PDF preview. Start typing to see your changes in real-time!

## Features

- ✅ **Syntax Highlighting** - Monaco Editor with Markdown support
- ✅ **Live Preview** - See your PDF update as you type
- ✅ **GitHub Flavored Markdown** - Full GFM support
- ✅ **Export to PDF** - Download your document instantly

## Supported Markdown

### Text Formatting

You can make text **bold**, *italic*, or ***both***. You can also ~~strikethrough~~ text.

### Code Blocks

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

### Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Editor | ✅ Working | Monaco Editor |
| Preview | ✅ Live | Real-time updates |
| Export | ✅ Ready | PDF download |

### Lists

1. **Ordered lists** work great
2. You can have multiple levels
   - Unordered sublists
   - With multiple items
3. Back to the main list

### Links and Images

- [Visit our GitHub](https://github.com)
- [Learn Markdown](https://www.markdownguide.org)

### Blockquotes

> This is a blockquote. You can use it to highlight important information or quotes from other sources.
> 
> It supports multiple paragraphs too!

---

**Start editing this content** to see the live preview in action! 🚀`);

  const [title, setTitle] = useState('My Document');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMarkdownChange = (newContent: string) => {
    setMarkdownContent(newContent);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClear = () => {
    if (
      confirm(
        'Are you sure you want to clear all content? This action cannot be undone.'
      )
    ) {
      setMarkdownContent('');
    }
  };

  const handleLoadSample = () => {
    setMarkdownContent(`# Sample Document

This is a sample document to demonstrate the Markdown to PDF converter.

## Introduction

Welcome to our **Markdown to PDF** converter! This tool allows you to write in Markdown and see a live preview of your PDF document.

## Features

### Text Formatting
- **Bold text**
- *Italic text*
- ***Bold and italic***
- ~~Strikethrough~~
- \`Inline code\`

### Code Blocks

\`\`\`python
def hello_world():
    print("Hello, World!")
    return "Success"

# Call the function
result = hello_world()
\`\`\`

### Tables

| Language | Popularity | Use Case |
|----------|------------|----------|
| Python | High | Data Science, Web |
| JavaScript | Very High | Web Development |
| TypeScript | Growing | Large Applications |

### Lists

1. First item
2. Second item
   - Nested item
   - Another nested item
3. Third item

### Mathematical Expressions

You can include math: $E = mc^2$

### Blockquotes

> "The best way to predict the future is to create it."
> — Peter Drucker

---

**Happy writing!** 📝`);
  };

  return (
    <div
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'w-full'}`}
    >
      {/* Header */}
      <div className="bg-card border border-border rounded-t-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Live Editor</h2>
            <div className="flex items-center space-x-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title:
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="px-3 py-1 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Document title"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadSample}
              className="px-3 py-1 text-sm bg-muted text-muted-foreground hover:bg-muted/80 rounded-md transition-colors"
            >
              Load Sample
            </button>

            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md transition-colors"
            >
              Clear
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              )}
            </button>

            {!isFullscreen && (
              <button
                onClick={onReset}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Upload
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor and Preview */}
      <div
        className={`grid ${isFullscreen ? 'h-[calc(100vh-73px)]' : 'h-[600px]'} lg:grid-cols-2 grid-cols-1 gap-0 border-x border-b border-border rounded-b-lg overflow-hidden`}
      >
        {/* Left Panel - Editor */}
        <div className="h-full">
          <MarkdownEditor
            value={markdownContent}
            onChange={handleMarkdownChange}
          />
        </div>

        {/* Right Panel - Preview */}
        <div className="h-full border-l border-border lg:block hidden">
          <PDFPreview markdownContent={markdownContent} title={title} />
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden mt-4">
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">PDF Preview</h3>
          </div>
          <div className="h-[400px]">
            <PDFPreview markdownContent={markdownContent} title={title} />
          </div>
        </div>
      </div>

      {/* Character Count */}
      <div className="mt-2 text-right">
        <span className="text-xs text-muted-foreground">
          {markdownContent.length} characters
        </span>
      </div>
    </div>
  );
};
