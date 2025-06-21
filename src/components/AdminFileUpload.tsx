"use client";

import { useState, useRef } from "react";
import { db, storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";

interface AdminFileUploadProps {
  onArticleSubmitted?: () => void;
}

export default function AdminFileUpload({ onArticleSubmitted }: AdminFileUploadProps) {
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const articleFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!articleFile || !authorName.trim() || !title.trim() || !abstract.trim() || !keywords.trim()) {
      toast.error("Please fill in all required fields and upload the article file");
      return;
    }
    
    setUploading(true);
    
    try {
      // Generate unique file name
      const articleFileExtension = articleFile.name.split('.').pop();
      const uniqueArticleFileName = `admin-${Date.now()}-${articleFile.name}`;
      
      // Upload article file
      const articleStorageRef = ref(storage, `articles/${uniqueArticleFileName}`);
      const articleUploadResult = await uploadBytes(articleStorageRef, articleFile);
      const articleDownloadURL = await getDownloadURL(articleUploadResult.ref);
      
      // Save article metadata to Firestore with approved status
      await addDoc(collection(db, "articles"), {
        name: articleFile.name,
        authorName: authorName,
        title: title,
        abstract: abstract,
        keywords: keywords,
        downloadURL: articleDownloadURL,
        timestamp: new Date(),
        fileType: articleFileExtension,
        status: "approved", // Admin submissions are auto-approved
        issue: "current", // Auto-add to current issue
        undertakingId: null, // No undertaking required for admin
        approvedDate: new Date(),
        submittedBy: "admin"
      });
      
      toast.success("Article has been submitted successfully and added to the current issue!");
      
      // Call the callback to refresh the parent component
      if (onArticleSubmitted) {
        onArticleSubmitted();
      }
      
      // Reset form
      setArticleFile(null);
      setAuthorName("");
      setTitle("");
      setAbstract("");
      setKeywords("");
      if (articleFileInputRef.current) {
        articleFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading article:", error);
      toast.error("Failed to upload article. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-right" />
      <div className="bg-[var(--background)] shadow-md rounded-lg p-6 border border-[var(--border)]">
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Submit Article (Admin)</h2>
        <p className="text-[var(--secondary-text)] mb-6">
          As an admin, you can submit articles directly to the current issue without requiring an undertaking form.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Author Name *
            </label>
            <input
              type="text"
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--secondary-background)] text-[var(--foreground)]"
              placeholder="Enter the author's full name"
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Article Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--secondary-background)] text-[var(--foreground)]"
              placeholder="Enter the title of the article"
              required
            />
          </div>

          <div>
            <label htmlFor="abstract" className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Abstract *
            </label>
            <textarea
              id="abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent h-32 bg-[var(--secondary-background)] text-[var(--foreground)]"
              placeholder="Enter the abstract of the article"
              required
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Keywords *
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--secondary-background)] text-[var(--foreground)]"
              placeholder="Enter keywords separated by commas"
              required
            />
          </div>
          
          <div>
            <label htmlFor="articleFile" className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Article File (.doc or .docx only) *
            </label>
            <input
              type="file"
              id="articleFile"
              ref={articleFileInputRef}
              onChange={handleArticleFileChange}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--secondary-background)] text-[var(--foreground)]"
              accept=".doc,.docx"
              required
            />
            <p className="text-xs mt-1 text-[var(--secondary-text)]">
              Only Microsoft Word documents (.doc or .docx) are accepted
            </p>
          </div>
          
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--accent)] hover:bg-opacity-90"
            }`}
          >
            {uploading ? "Uploading..." : "Submit Article"}
          </button>
        </form>
      </div>
    </div>
  );
} 