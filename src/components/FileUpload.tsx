"use client";

import { useState, useRef } from "react";
import { db, storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";

export default function FileUpload() {
  const [authorName, setAuthorName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.log("Uploading to storage path:", `submissions/${uniqueFileName}`);
      
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      console.log("File uploaded successfully, download URL:", downloadURL);
      
      // Save metadata to Firestore
      await addDoc(collection(db, "uploadedFiles"), {
        name: file.name,
        authorName: authorName,
        downloadURL: downloadURL,
        timestamp: new Date(),
        fileType: fileExtension,
        status: "pending",
      });
      
      toast.success("Your article has been submitted successfully! It will be reviewed by our editorial team.");
      
      // Reset form
      setFile(null);
      setAuthorName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
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
            {uploading ? "Uploading..." : "Submit Article"}
          </button>
        </form>
      </div>
    </div>
  );
} 