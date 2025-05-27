import { ConversionPanel } from './components/ConversionPanel';
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

function App() {
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert your Markdown files to beautifully formatted PDF documents.
            Simply upload your .md file and get a professional PDF in seconds.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {uploadedFile ? (
            <ConversionPanel
              file={uploadedFile}
              onError={handleError}
              onSuccess={handleSuccess}
              onReset={handleReset}
            />
          ) : (
            <FileUpload
              onFileUploaded={handleFileUploaded}
              onError={handleError}
            />
          )}
        </div>

        {/* Features Section */}
        {!uploadedFile && (
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Professional Output
                </h3>
                <p className="text-muted-foreground">
                  Get beautifully formatted PDFs with proper typography, syntax
                  highlighting, and styling.
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
