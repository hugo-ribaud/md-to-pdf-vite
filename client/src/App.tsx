import { ConversionPanel } from './components/ConversionPanel';
import { EditorPanel } from './components/EditorPanel';
import { FileUpload } from './components/FileUpload';
import { Notification } from './components/Notification';
import { useState } from 'react';

interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

interface NotificationState {
  type: 'success' | 'error';
  message: string;
}

type AppMode = 'upload' | 'editor';

function App() {
  const [mode, setMode] = useState<AppMode>('upload');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFile(file);
    setNotification({
      type: 'success',
      message: `File "${file.originalName}" uploaded successfully!`,
    });
  };

  const handleError = (message: string) => {
    setNotification({
      type: 'error',
      message,
    });
  };

  const handleSuccess = (message: string) => {
    setNotification({
      type: 'success',
      message,
    });
  };

  const handleReset = () => {
    setUploadedFile(null);
    setMode('upload');
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setUploadedFile(null);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Markdown to PDF Converter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Convert your Markdown files to beautifully formatted PDF documents.
            Upload a file or use our live editor with instant preview.
          </p>

          {/* Mode Toggle */}
          <div className="flex items-center justify-center space-x-1 bg-muted p-1 rounded-lg max-w-md mx-auto">
            <button
              onClick={() => handleModeChange('upload')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'upload'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>File Upload</span>
              </div>
            </button>
            <button
              onClick={() => handleModeChange('editor')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'editor'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Live Editor</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {mode === 'editor' ? (
            <EditorPanel
              onError={handleError}
              onSuccess={handleSuccess}
              onReset={handleReset}
            />
          ) : uploadedFile ? (
            <div className="max-w-4xl mx-auto">
              <ConversionPanel
                file={uploadedFile}
                onError={handleError}
                onSuccess={handleSuccess}
                onReset={handleReset}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <FileUpload
                onFileUploaded={handleFileUploaded}
                onError={handleError}
              />
            </div>
          )}
        </div>

        {/* Features Section - Only show in upload mode when no file is uploaded */}
        {mode === 'upload' && !uploadedFile && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Conversion</h3>
                <p className="text-muted-foreground">
                  Convert your Markdown files to PDF in seconds with our
                  optimized processing engine.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Rich Formatting</h3>
                <p className="text-muted-foreground">
                  Support for tables, code highlighting, math equations, and all
                  GitHub Flavored Markdown features.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your files are processed securely and automatically deleted
                  after conversion.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Editor Features Section - Only show in editor mode */}
        {mode === 'editor' && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Live Editor Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                <p className="text-muted-foreground">
                  See your PDF update in real-time as you type with our instant
                  preview system.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Syntax Highlighting
                </h3>
                <p className="text-muted-foreground">
                  Monaco Editor with full Markdown syntax highlighting and
                  auto-completion.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center text-muted-foreground">
          <p>Built with React, TypeScript, Express, and Tailwind CSS v4</p>
        </footer>
      </div>

      {/* Notifications */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

export default App;
