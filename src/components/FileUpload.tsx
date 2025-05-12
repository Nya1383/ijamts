"use client";

import { useState, useRef } from "react";
import { db, storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";

export default function FileUpload() {
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [undertakingFile, setUndertakingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const articleFileInputRef = useRef<HTMLInputElement>(null);
  const undertakingFileInputRef = useRef<HTMLInputElement>(null);

  const handleArticleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'doc' || fileExtension === 'docx') {
        setArticleFile(selectedFile);
      } else {
        toast.error("Please upload only .doc or .docx files");
        if (articleFileInputRef.current) {
          articleFileInputRef.current.value = "";
        }
      }
    }
  };

  const handleUndertakingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'doc' || fileExtension === 'docx') {
        setUndertakingFile(selectedFile);
      } else {
        toast.error("Please upload only .doc or .docx files for the undertaking form");
        if (undertakingFileInputRef.current) {
          undertakingFileInputRef.current.value = "";
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!articleFile || !undertakingFile || !authorName.trim() || !title.trim() || !abstract.trim() || !keywords.trim()) {
      toast.error("Please fill in all required fields and upload both files");
      return;
    }
    
    setUploading(true);
    
    try {
      // Generate unique file names
      const articleFileExtension = articleFile.name.split('.').pop();
      const undertakingFileExtension = undertakingFile.name.split('.').pop();
      const uniqueArticleFileName = `${Date.now()}-article-${articleFile.name}`;
      const uniqueUndertakingFileName = `${Date.now()}-undertaking-${undertakingFile.name}`;
      
      // Upload article file
      const articleStorageRef = ref(storage, `articles/${uniqueArticleFileName}`);
      const articleUploadResult = await uploadBytes(articleStorageRef, articleFile);
      const articleDownloadURL = await getDownloadURL(articleUploadResult.ref);
      
      // Upload undertaking file
      const undertakingStorageRef = ref(storage, `undertakings/${uniqueUndertakingFileName}`);
      const undertakingUploadResult = await uploadBytes(undertakingStorageRef, undertakingFile);
      const undertakingDownloadURL = await getDownloadURL(undertakingUploadResult.ref);
      
      // Save article metadata to Firestore
      const articleDoc = await addDoc(collection(db, "articles"), {
        name: articleFile.name,
        authorName: authorName,
        title: title,
        abstract: abstract,
        keywords: keywords,
        downloadURL: articleDownloadURL,
        timestamp: new Date(),
        fileType: articleFileExtension,
        status: "pending",
        undertakingId: null // Will be updated after creating undertaking doc
      });

      // Save undertaking metadata to Firestore
      const undertakingDoc = await addDoc(collection(db, "undertakings"), {
        name: undertakingFile.name,
        authorName: authorName,
        downloadURL: undertakingDownloadURL,
        timestamp: new Date(),
        fileType: undertakingFileExtension,
        status: "pending",
        articleId: articleDoc.id
      });

      // Update article with undertaking reference
      await updateDoc(doc(db, "articles", articleDoc.id), {
        undertakingId: undertakingDoc.id
      });
      
      toast.success("Your article and undertaking form have been submitted successfully! They will be reviewed by our editorial team.");
      
      // Reset form
      setArticleFile(null);
      setUndertakingFile(null);
      setAuthorName("");
      setTitle("");
      setAbstract("");
      setKeywords("");
      if (articleFileInputRef.current) {
        articleFileInputRef.current.value = "";
      }
      if (undertakingFileInputRef.current) {
        undertakingFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files. Please try again.");
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
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Article Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the title of your article"
              required
            />
          </div>

          <div>
            <label htmlFor="abstract" className="block text-sm font-medium mb-1">
              Abstract
            </label>
            <textarea
              id="abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              placeholder="Enter the abstract of your article"
              required
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium mb-1">
              Keywords
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter keywords separated by commas"
              required
            />
          </div>
          
          <div>
            <label htmlFor="articleFile" className="block text-sm font-medium mb-1">
              Article File (.doc or .docx only)
            </label>
            <input
              type="file"
              id="articleFile"
              ref={articleFileInputRef}
              onChange={handleArticleFileChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              accept=".doc,.docx"
              required
            />
            <p className="text-xs mt-1 text-gray-500">
              Only Microsoft Word documents (.doc or .docx) are accepted
            </p>
          </div>

          <div>
            <label htmlFor="undertakingFile" className="block text-sm font-medium mb-1">
              Undertaking Form (.doc or .docx only)
            </label>
            <input
              type="file"
              id="undertakingFile"
              ref={undertakingFileInputRef}
              onChange={handleUndertakingFileChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              accept=".doc,.docx"
              required
            />
            <p className="text-xs mt-1 text-gray-500">
              Only Microsoft Word documents (.doc or .docx) are accepted for the undertaking form
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