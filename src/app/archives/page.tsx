"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";

type Article = {
  id: string;
  name: string;
  authorName: string;
  downloadURL: string;
  timestamp: Date;
  fileType: string;
  status?: string;
  undertakingId: string;
  issue?: string;
  title?: string;
  abstract?: string;
  keywords?: string;
  archiveName?: string;
};

type Archive = {
  id: string;
  name: string;
  createdAt: Date;
};

export default function ArchivesPage() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [archivedArticles, setArchivedArticles] = useState<{ [key: string]: Article[] }>({});
  const [loading, setLoading] = useState(true);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const archivesRef = collection(db, "archives");
      const archivesSnapshot = await getDocs(archivesRef);
      const archivesList: Archive[] = [];
      
      archivesSnapshot.forEach((doc) => {
        const data = doc.data();
        archivesList.push({
          id: doc.id,
          name: data.name,
          createdAt: data.createdAt.toDate()
        });
      });
      
      setArchives(archivesList);
      
      // Fetch articles for each archive
      const articlesRef = collection(db, "articles");
      const articlesSnapshot = await getDocs(articlesRef);
      const archiveArticles: { [key: string]: Article[] } = {};
      
      articlesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "approved" && data.archiveName) {
          const article = {
            id: doc.id,
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
          };
          
          if (!archiveArticles[data.archiveName]) {
            archiveArticles[data.archiveName] = [];
          }
          archiveArticles[data.archiveName].push(article);
        }
      });
      
      setArchivedArticles(archiveArticles);
    } catch (error) {
      console.error("Error fetching archives:", error);
      toast.error("Failed to load archives");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (article: Article) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = article.downloadURL;
    downloadLink.download = article.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("Download started");
  };

  const toggleArticleDetails = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  return (
    <div className="container py-12">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Archives</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-[var(--accent)] rounded-full border-t-transparent"></div>
          </div>
        ) : archives.length === 0 ? (
          <div className="text-center py-12 bg-[var(--background)] rounded-lg">
            <p className="text-[var(--secondary-text)]">No archives available.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {archives.map((archive) => (
              <div key={archive.id} className="bg-[var(--background)] shadow-md rounded-lg border border-[var(--border)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border)]">
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">{archive.name}</h2>
                  <p className="text-sm text-[var(--secondary-text)] mt-1">
                    Created on {archive.createdAt.toLocaleDateString()}
                  </p>
                </div>
                
                {archivedArticles[archive.name]?.length > 0 ? (
                  <div className="divide-y divide-[var(--border)]">
                    {archivedArticles[archive.name].map((article) => (
                      <div key={article.id} className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-[var(--foreground)]">
                              {article.title || article.name}
                            </h3>
                            <p className="text-sm text-[var(--secondary-text)] mt-1">
                              By {article.authorName}
                            </p>
                            <p className="text-sm text-[var(--secondary-text)]">
                              Published on {article.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleArticleDetails(article.id)}
                              className="px-3 py-1 text-sm text-[var(--accent)] hover:underline"
                            >
                              {expandedArticle === article.id ? 'Hide Details' : 'Show Details'}
                            </button>
                            <button
                              onClick={() => handleDownload(article)}
                              className="px-4 py-1 bg-[var(--accent)] text-white rounded-md hover:bg-opacity-90 text-sm"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                        
                        {expandedArticle === article.id && (
                          <div className="mt-4 p-4 bg-[var(--secondary-background)] rounded-md">
                            {article.abstract && (
                              <div className="mb-4">
                                <h4 className="font-medium text-[var(--foreground)] mb-2">Abstract</h4>
                                <p className="text-sm text-[var(--foreground)]">{article.abstract}</p>
                              </div>
                            )}
                            {article.keywords && (
                              <div>
                                <h4 className="font-medium text-[var(--foreground)] mb-2">Keywords</h4>
                                <p className="text-sm text-[var(--foreground)]">{article.keywords}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-[var(--secondary-text)]">
                    No articles in this archive yet.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 