import React, { useEffect, useState } from 'react';

interface PDFPreviewProps {
  markdownContent: string;
  title?: string;
  isGenerating?: boolean;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  markdownContent,
  title = 'Preview',
  isGenerating = false,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastContent, setLastContent] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const generatePreview = async (content: string) => {
    if (!content.trim() || content === lastContent) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastContent(content);

    try {
      const response = await fetch('/api/convert/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title,
          options: {
            format: 'A4',
            printBackground: true,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 'Preview generation failed'
        );
      }

      // Create blob URL for PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Clean up previous URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      setPdfUrl(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Preview generation failed'
      );
      console.error('Preview generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced effect to generate preview
  useEffect(() => {
    if (!markdownContent.trim()) {
      setPdfUrl(null);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      generatePreview(markdownContent);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [markdownContent, title]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleRefresh = () => {
    if (markdownContent.trim()) {
      generatePreview(markdownContent);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Create clean PDF URL without browser controls
  const getCleanPdfUrl = (url: string) => {
    return `${url}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0&view=FitH`;
  };

  return (
    <div className="h-full border border-border rounded-lg overflow-hidden bg-background">
      <div className="bg-muted/50 px-4 py-2 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">PDF Preview</h3>
          <div className="flex items-center space-x-2">
            {(isLoading || isGenerating) && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full"></div>
                <span>Generating...</span>
              </div>
            )}

            {pdfUrl && (
              <button
                onClick={toggleDarkMode}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title={
                  isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }
              >
                {isDarkMode ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            )}

            <button
              onClick={handleRefresh}
              disabled={isLoading || !markdownContent.trim()}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh preview"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {pdfUrl && (
              <button
                onClick={handleDownload}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Download PDF"
              >
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-49px)] relative">
        {error ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-destructive mb-2">
                  Preview Error
                </h4>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : !markdownContent.trim() ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
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
              <div>
                <h4 className="text-lg font-semibold mb-2">Start Typing</h4>
                <p className="text-sm text-muted-foreground">
                  Your PDF preview will appear here as you type in the editor
                </p>
              </div>
            </div>
          </div>
        ) : pdfUrl ? (
          <div
            className={`w-full h-full relative transition-all duration-300 ${
              isDarkMode ? 'bg-gray-900 p-4' : 'bg-gray-50 p-2'
            }`}
          >
            <div
              className={`w-full h-full rounded-lg overflow-hidden transition-all duration-300 ${
                isDarkMode
                  ? 'shadow-2xl shadow-black/50 ring-1 ring-white/10'
                  : 'shadow-lg shadow-black/10 ring-1 ring-black/5'
              }`}
            >
              <iframe
                src={getCleanPdfUrl(pdfUrl)}
                className="w-full h-full border-0"
                title="PDF Preview"
                style={{
                  background: 'white',
                  border: 'none',
                  outline: 'none',
                }}
              />
            </div>

            {/* Dark mode overlay indicator */}
            {isDarkMode && (
              <div className="absolute top-6 right-6 bg-gray-800/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
                Dark Mode
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Generating preview...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
