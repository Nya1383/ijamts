"use client";

import { useState, useRef, useEffect } from "react";
import { db, storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import DocumentViewer from "./DocumentViewer";

type UploadedFile = {
  id: string;
  name: string;
  authorName: string;
  downloadURL: string;
  timestamp: Date;
  fileType: string;
};

export default function FileUpload() {
  const [authorName, setAuthorName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [viewingDocument, setViewingDocument] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const filesRef = collection(db, "uploadedFiles");
      const q = query(filesRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      
      const files: UploadedFile[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        files.push({
          id: doc.id,
          name: data.name,
          authorName: data.authorName,
          downloadURL: data.downloadURL,
          timestamp: data.timestamp.toDate(),
          fileType: data.fileType,
        });
      });
      
      setUploadedFiles(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load uploaded files");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'doc' || fileExtension === 'docx') {
        setFile(selectedFile);
      } else {
        toast.error("Please upload only .doc or .docx files");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleViewDocument = (file: UploadedFile) => {
    setViewingDocument(file);
  };

  const handleCloseViewer = () => {
    setViewingDocument(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !authorName.trim()) {
      toast.error("Please provide your name and select a file");
      return;
    }
    
    setUploading(true);
    
    try {
      // Generate a unique file name to prevent overwrites
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}-${file.name}`;
      
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `submissions/${uniqueFileName}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      // Save metadata to Firestore
      const docRef = await addDoc(collection(db, "uploadedFiles"), {
        name: file.name,
        authorName: authorName,
        downloadURL: downloadURL,
        timestamp: new Date(),
        fileType: fileExtension,
      });
      
      toast.success("File uploaded successfully!");
      
      // Reset form
      setFile(null);
      setAuthorName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Refresh the file list
      fetchUploadedFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-right" />
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Submit Your Article</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium mb-1">
              Author Name
            </label>
            <input
              type="text"
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium mb-1">
              Document File (.doc or .docx only)
            </label>
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              accept=".doc,.docx"
              required
            />
            <p className="text-xs mt-1 text-gray-500">
              Only Microsoft Word documents (.doc or .docx) are accepted
            </p>
          </div>
          
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Your Uploaded Documents</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Uploaded
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uploadedFiles.map((file) => (
                  <tr key={file.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{file.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">{file.authorName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {file.timestamp.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleViewDocument(file)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View
                      </button>
                      <a
                        href={file.downloadURL}
                        download={file.name}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
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