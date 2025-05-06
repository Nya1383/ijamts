"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import DocumentViewer from "@/components/DocumentViewer";

type UploadedFile = {
  id: string;
  name: string;
  authorName: string;
  downloadURL: string;
  timestamp: Date;
  fileType: string;
  status?: string;
};

export default function ArchivesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDocument, setViewingDocument] = useState<UploadedFile | null>(null);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const filesRef = collection(db, "uploadedFiles");
      // Get all files and filter in JS to ensure we avoid query errors
      const q = query(filesRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      
      const files: UploadedFile[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only include documents with status "approved"
        if (data.status === "approved") {
          files.push({
            id: doc.id,
            name: data.name,
            authorName: data.authorName,
            downloadURL: data.downloadURL,
            timestamp: data.timestamp.toDate(),
            fileType: data.fileType,
            status: data.status,
          });
        }
      });
      
      setUploadedFiles(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load archived documents");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (file: UploadedFile) => {
    setViewingDocument(file);
  };

  const handleCloseViewer = () => {
    setViewingDocument(null);
  };

  return (
    <div className="container py-12">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Archives</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Browse all published articles and submissions
        </p>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : uploadedFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedFiles.map((file) => (
              <div 
                key={file.id} 
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1 line-clamp-2">{file.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      By: {file.authorName}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                      Uploaded: {file.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-2">
                    <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {file.fileType}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleViewDocument(file)}
                    className="flex-1 text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    View
                  </button>
                  <a
                    href={file.downloadURL}
                    download={file.name}
                    className="flex-1 text-center py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No published documents are available yet.</p>
          </div>
        )}
      </div>
      
      {viewingDocument && (
        <DocumentViewer
          documentUrl={viewingDocument.downloadURL}
          fileName={viewingDocument.name}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
} 