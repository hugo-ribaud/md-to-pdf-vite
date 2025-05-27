import React, { useState } from 'react';

interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

interface ConversionPanelProps {
  file: UploadedFile;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  onReset: () => void;
}

export const ConversionPanel: React.FC<ConversionPanelProps> = ({
  file,
  onError,
  onSuccess,
  onReset,
}) => {
  const [isConverting, setIsConverting] = useState(false);
  const [title, setTitle] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleConvert = async () => {
    setIsConverting(true);

    try {
      const response = await fetch(`/api/convert/${file.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || file.originalName.replace(/\.[^/.]+$/, ''),
          options: {
            format: 'A4',
            printBackground: true,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Conversion failed');
      }

      // Handle PDF download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || file.originalName.replace(/\.[^/.]+$/, '')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onSuccess('PDF generated and downloaded successfully!');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const handlePreview = () => {
    const previewUrl = `/api/convert/preview/${file.id}`;
    window.open(previewUrl, '_blank');
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/upload/${file.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete file');
      }

      onReset();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to delete file');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* File Info Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">
                {file.originalName}
              </h3>
              <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                <p>Size: {formatFileSize(file.size)}</p>
                <p>Uploaded: {formatDate(file.uploadedAt)}</p>
                <p>File ID: {file.id}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="text-destructive hover:text-destructive/80 p-2 rounded-md hover:bg-destructive/10 transition-colors"
            title="Delete file"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Conversion Options */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Conversion Options</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              PDF Title (optional)
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={file.originalName.replace(/\.[^/.]+$/, '')}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isConverting}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              This will be used as the PDF filename and document title
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handlePreview}
          className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/80 transition-colors font-medium flex items-center justify-center space-x-2"
          disabled={isConverting}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>Preview</span>
        </button>

        <button
          onClick={handleConvert}
          disabled={isConverting}
          className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConverting ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
              <span>Converting...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Convert to PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Upload Another File */}
      <div className="text-center pt-4 border-t border-border">
        <button
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          disabled={isConverting}
        >
          Upload another file
        </button>
      </div>
    </div>
  );
};
