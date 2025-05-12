"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { getArticleUrl } from "@/lib/utils";

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
  approvedDate?: Date;
  title?: string;
  abstract?: string;
  keywords?: string;
};

export default function CurrentIssue() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentIssueTitle, setCurrentIssueTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles();
    fetchCurrentIssueTitle();
  }, []);

  useEffect(() => {
    // Filter articles based on search query
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Filter articles that match the query in title or author name
    const matchingArticles = articles.filter(article => 
      (article.title?.toLowerCase().includes(query) || false) || 
      article.authorName.toLowerCase().includes(query)
    );
    
    setFilteredArticles(matchingArticles);
  }, [searchQuery, articles]);

  const fetchCurrentIssueTitle = async () => {
    try {
      const titleDoc = await getDocs(collection(db, "currentIssue"));
      if (!titleDoc.empty) {
        setCurrentIssueTitle(titleDoc.docs[0].data().title || "");
      }
    } catch (error) {
      console.error("Error fetching current issue title:", error);
      toast.error("Failed to load current issue title");
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      // Fetch articles from current issue
      const articlesRef = collection(db, "articles");
      const queryCurrentIssue = query(
        articlesRef,
        orderBy("approvedDate", "desc")
      );
      const snapshot = await getDocs(queryCurrentIssue);

      const currentIssueArticles: Article[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "approved" && data.issue === "current") {
          currentIssueArticles.push({
            id: doc.id,
            name: data.name,
            authorName: data.authorName,
            downloadURL: data.downloadURL,
            timestamp: data.timestamp.toDate(),
            fileType: data.fileType,
            status: data.status,
            undertakingId: data.undertakingId,
            issue: data.issue,
            approvedDate: data.approvedDate?.toDate(),
            title: data.title,
            abstract: data.abstract,
            keywords: data.keywords
          });
        }
      });
      
      setArticles(currentIssueArticles);
      setFilteredArticles(currentIssueArticles);
      
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load current issue articles");
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            {currentIssueTitle || "Current Issue"}
          </h1>
          <p className="mt-2 text-[var(--secondary-text)]">
            Latest approved articles in the current issue
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title or author name..."
              className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--secondary-text)] hover:text-[var(--foreground)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-[var(--secondary-text)]">
              Showing results for: <span className="font-medium text-[var(--foreground)]">"{searchQuery}"</span>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-[var(--accent)] rounded-full border-t-transparent"></div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-[var(--background)] rounded-lg">
            {searchQuery ? (
              <div>
                <p className="text-[var(--secondary-text)] mb-4">No results found for "{searchQuery}".</p>
                <button 
                  onClick={clearSearch}
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <p className="text-[var(--secondary-text)]">
                No articles in the current issue yet.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-[var(--background)] shadow-md rounded-lg border border-[var(--border)] overflow-hidden">
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
                <tbody className="divide-y divide-[var(--border)] bg-[var(--background)]">
                  {filteredArticles.map((article) => (
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
                          {article.approvedDate?.toLocaleDateString() || article.timestamp.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap space-x-2">
                        <Link
                          href={getArticleUrl(article.id, article.title)}
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
          </div>
        )}
      </div>

      {/* Article Details Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--background)] p-6 rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Article Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-[var(--secondary-text)] hover:text-[var(--foreground)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[var(--secondary-text)] mb-1">Title</h3>
                <p className="text-[var(--foreground)]">{selectedArticle.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--secondary-text)] mb-1">Abstract</h3>
                <p className="text-[var(--foreground)] whitespace-pre-wrap">{selectedArticle.abstract}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--secondary-text)] mb-1">Keywords</h3>
                <p className="text-[var(--foreground)]">{selectedArticle.keywords}</p>
              </div>
              <div className="pt-4 border-t border-[var(--border)]">
                <div className="flex justify-between text-sm text-[var(--secondary-text)]">
                  <span>Author: {selectedArticle.authorName}</span>
                  <span>Published: {selectedArticle.approvedDate?.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 