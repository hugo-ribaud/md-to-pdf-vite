import React, { useCallback, useState } from 'react';

interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile) => void;
  onError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['.md', '.markdown', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return 'Please select a Markdown file (.md, .markdown, or .txt)';
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    // Check if file is empty
    if (file.size === 0) {
      return 'File cannot be empty';
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('markdown', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await response.json();

      if (result.success) {
        onFileUploaded(result.file);
        setUploadProgress(100);
      } else {
        throw new Error(result.error?.message || 'Upload failed');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 1) {
        onError('Please upload only one file at a time');
        return;
      }

      if (files.length === 1) {
        uploadFile(files[0]);
      }
    },
    [onError]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        uploadFile(files[0]);
      }
      // Reset input value to allow uploading the same file again
      e.target.value = '';
    },
    []
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${
            isDragging
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploading file...</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
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
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragging ? 'Drop your file here' : 'Upload Markdown File'}
              </h3>
              <p className="text-muted-foreground">
                Drag and drop your .md, .markdown, or .txt file here, or click
                to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 10MB
              </p>
            </div>

            <button
              type="button"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Choose File
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Supported formats: Markdown (.md), Markdown (.markdown), Text (.txt)
        </p>
      </div>
    </div>
  );
};
