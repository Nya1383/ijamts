"use client";

import { useState, useEffect, useRef, memo } from "react";
import { toast } from "react-hot-toast";

interface DocumentViewerProps {
  documentUrl: string;
  fileName: string;
  onClose: () => void;
}

// Memoize the component to prevent unnecessary re-renders
const DocumentViewer = memo(({ documentUrl, fileName, onClose }: DocumentViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Load the document directly without going through Google Docs first
  const directUrl = documentUrl;

  useEffect(() => {
    // Reset states when props change
    setLoading(true);
    setLoadError(false);
    setRetryCount(0);
    
    // Set a timeout to hide the loading indicator after a reasonable time
    const timer = setTimeout(() => {
      if (loading) {
        // Check if iframe content has loaded successfully
        const iframe = iframeRef.current;
        if (iframe) {
          try {
            // Try to access iframe content - if accessible, it's loaded
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc || !iframeDoc.body.innerHTML) {
              handleLoadError();
            } else {
              setLoading(false);
            }
          } catch (error) {
            // Cross-origin issues or other errors
            handleLoadError();
          }
        }
      }
    }, 6000); // Reduced timeout for better user experience
    
    return () => clearTimeout(timer);
  }, [documentUrl, retryCount]);

  const handleIframeLoad = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      
      // Check if iframe loaded error page or empty content
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc && iframeDoc.body.innerHTML.length > 50) {
        // Successfully loaded with content
        setLoading(false);
        setLoadError(false);
      } else {
        // Empty or error page
        handleLoadError();
      }
    } catch (error) {
      // Cross-origin issues or other errors
      console.log("Error checking iframe content:", error);
      setLoading(false); // Assume it loaded anyway
    }
  };

  const handleLoadError = () => {
    console.log("Document viewer load error, retry count:", retryCount);
    if (retryCount < maxRetries) {
      // Retry loading
      setRetryCount(prevCount => prevCount + 1);
    } else {
      // Stop retrying and show error
      setLoading(false);
      setLoadError(true);
      toast.error("Unable to preview document. You can download it instead.");
    }
  };

  const handleDownload = () => {
    try {
      window.open(documentUrl, "_blank");
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Error downloading the document");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-semibold truncate">{fileName}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium transition-colors"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 z-10">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading document...</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">This may take a few moments</p>
              {retryCount > 0 && (
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Retrying... ({retryCount}/{maxRetries})
                </p>
              )}
              <button
                onClick={handleDownload}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Download Instead
              </button>
            </div>
          )}
          
          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Unable to preview document</p>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                The document preview could not be loaded. Please download the file to view it instead.
              </p>
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Download Document
              </button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              title={`Preview of ${fileName}`}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  );
});

DocumentViewer.displayName = 'DocumentViewer';
export default DocumentViewer; 