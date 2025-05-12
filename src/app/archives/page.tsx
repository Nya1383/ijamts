"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleShowDetails = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseDetails = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="container py-12">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">Archives</h1>
        
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
                <div className="p-4 border-b border-[var(--border)]">
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">{archive.name}</h2>
                  <p className="text-sm text-[var(--secondary-text)]">
                    Created on {archive.createdAt.toLocaleDateString()}
                  </p>
                </div>
                
                {archivedArticles[archive.name]?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                            Article
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                            Author
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                            Date Published
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {archivedArticles[archive.name].map((article) => (
                          <tr key={article.id}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-[var(--foreground)]">{article.title || article.name}</div>
                              <div className="text-xs text-[var(--secondary-text)]">{article.fileType}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-[var(--foreground)]">{article.authorName}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-[var(--foreground)]">
                                {article.timestamp.toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap space-x-2">
                              <Link
                                href={`/article/${article.id}`}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                              >
                                View Details
                              </Link>
                              <button
                                onClick={() => handleDownload(article)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-[var(--secondary-text)]">
                    No articles in this archive.
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