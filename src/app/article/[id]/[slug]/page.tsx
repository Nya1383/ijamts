"use client";

import { useState, useEffect } from "react";
import { db } from "../../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

type Article = {
  id: string;
  name: string;
  authorName: string;
  downloadURL: string;
  timestamp: Date;
  fileType: string;
  status: string;
  undertakingId: string;
  issue: string;
  title?: string;
  abstract?: string;
  keywords?: string;
  archiveName?: string;
};

export default function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const articleId = params.id as string;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleDoc = await getDoc(doc(db, "articles", articleId));
        if (articleDoc.exists()) {
          const data = articleDoc.data();
          setArticle({
            id: articleDoc.id,
            name: data.name,
            authorName: data.authorName,
            downloadURL: data.downloadURL,
            timestamp: data.timestamp.toDate(),
            fileType: data.fileType,
            status: data.status,
            undertakingId: data.undertakingId,
            issue: data.issue,
            title: data.title,
            abstract: data.abstract,
            keywords: data.keywords,
            archiveName: data.archiveName
          });
        } else {
          toast.error("Article not found");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleDownload = () => {
    if (!article) return;
    
    const downloadLink = document.createElement('a');
    downloadLink.href = article.downloadURL;
    downloadLink.download = article.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("Download started");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[var(--accent)] rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">Article Not Found</h1>
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-[var(--background)] rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)] text-center">
                {article.title || article.name}
              </h1>
            </div>

            {/* Author and Date */}
            <div className="text-center space-y-2">
              <p className="text-lg text-[var(--foreground)]">
                By {article.authorName}
              </p>
              <p className="text-sm text-[var(--secondary-text)]">
                Published on {article.timestamp.toLocaleDateString()}
              </p>
            </div>

            {/* Abstract */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Abstract</h2>
              <p className="text-[var(--secondary-text)] whitespace-pre-wrap">
                {article.abstract}
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Keywords</h2>
              <p className="text-[var(--secondary-text)]">
                {article.keywords}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4 pt-6">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-[var(--accent)] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Download Article
              </button>
              <Link
                href={article.archiveName ? "/archives" : "/current-issue"}
                className="px-6 py-3 border border-[var(--border)] rounded-md hover:bg-[var(--secondary-background)] transition-colors"
              >
                Back to {article.archiveName ? "Archives" : "Current Issue"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 