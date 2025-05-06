"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface DocumentViewerProps {
  documentUrl: string;
  fileName: string;
  onClose: () => void;
}

export default function DocumentViewer({ documentUrl, fileName, onClose }: DocumentViewerProps) {
  const [loading, setLoading] = useState(true);
  const [loadAttempted, setLoadAttempted] = useState(false);
  
  // Get direct document URL
  const getDirectUrl = () => {
    return documentUrl || '';
  };
  
  // Get Google Docs viewer URL
  const getGoogleViewerUrl = () => {
    if (!documentUrl) return '';
    return `https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`;
  };
  
  // Handle download
  const handleDownload = () => {
    if (!documentUrl) {
      toast.error("Invalid document URL");
      return;
    }
    window.open(documentUrl, "_blank");
    toast.success("Download started");
  };
  
  // Set a timeout for slow loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && loadAttempted) {
        toast.error("Document is taking longer than expected to load", {
          duration: 3000
        });
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [loading, loadAttempted]);
  
  // Mark as attempted to load after component mounts
  useEffect(() => {
    setLoadAttempted(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-semibold truncate">{fileName}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium"
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
              <button
                onClick={handleDownload}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              >
                Download Instead
              </button>
            </div>
          )}
          
          {/* Direct document link for PDF files (faster loading for PDFs) */}
          {documentUrl && documentUrl.toLowerCase().endsWith('.pdf') ? (
            <iframe
              src={getDirectUrl()}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                toast.error("Unable to preview PDF directly. Trying Google Docs viewer...");
                // When direct PDF fails, use the Google Docs viewer as fallback
                const iframe = document.createElement('iframe');
                iframe.src = getGoogleViewerUrl();
                iframe.className = "w-full h-full border-0";
                iframe.onload = () => setLoading(false);
                iframe.onerror = () => {
                  setLoading(false);
                  toast.error("Unable to preview document. Please download it instead.");
                };
                
                const container = document.getElementById('document-container');
                if (container) {
                  container.innerHTML = '';
                  container.appendChild(iframe);
                }
              }}
              title={`Preview of ${fileName}`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            />
          ) : (
            // Use Google Docs viewer for non-PDF files
            <iframe
              src={getGoogleViewerUrl()}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                toast.error("Unable to preview document. Please download it instead.");
              }}
              title={`Preview of ${fileName}`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            />
          )}
          
          {/* Hidden container for fallback iframe */}
          <div id="document-container" className="w-full h-full"></div>
        </div>
      </div>
    </div>
  );
} 