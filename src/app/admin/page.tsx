"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where,
  addDoc,
} from "firebase/firestore";
import DocumentViewer from "@/components/DocumentViewer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { ref } from "firebase/storage";

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

type Undertaking = {
  id: string;
  name: string;
  authorName: string;
  downloadURL: string;
  timestamp: Date;
  fileType: string;
  status?: string;
  articleId: string;
};

type Archive = {
  id: string;
  name: string;
  createdAt: Date;
};

export default function AdminDashboard() {
  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
  const [currentIssueArticles, setCurrentIssueArticles] = useState<Article[]>([]);
  const [archivedArticles, setArchivedArticles] = useState<{ [key: string]: Article[] }>({});
  const [archives, setArchives] = useState<Archive[]>([]);
  const [undertakings, setUndertakings] = useState<{ [key: string]: Undertaking }>({});
  const [loading, setLoading] = useState(true);
  const [viewingDocument, setViewingDocument] = useState<Article | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showCreateArchiveModal, setShowCreateArchiveModal] = useState(false);
  const [newArchiveName, setNewArchiveName] = useState("");
  const [showMoveToArchiveModal, setShowMoveToArchiveModal] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<string>("");
  const [approvalDetails, setApprovalDetails] = useState({
    title: '',
    abstract: '',
    keywords: '',
  });
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [currentIssueTitle, setCurrentIssueTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Add debug function to check storage configuration
  const debugStorageConfig = () => {
    console.log("Storage bucket:", storage.app.options.storageBucket);
    try {
      const testRef = ref(storage, 'test-path');
      console.log("Test storage reference:", testRef);
      console.log("Full path:", testRef.fullPath);
      console.log("Bucket:", testRef.bucket);
      
      // Check if the bucket matches the configuration
      if (testRef.bucket === storage.app.options.storageBucket) {
        console.log("✅ Storage bucket configuration is consistent");
      } else {
        console.error("❌ Storage bucket mismatch:", {
          configBucket: storage.app.options.storageBucket,
          referenceBucket: testRef.bucket
        });
      }
    } catch (error) {
      console.error("Error creating storage reference:", error);
    }
  };

  // Run the debug check once on mount when user is authenticated
  useEffect(() => {
    if (user) {
      // Debug storage config
      debugStorageConfig();
      // Fetch submissions
      fetchSubmissions();
      // Fetch current issue title
      fetchCurrentIssueTitle();
      // Fetch archives
      fetchArchives();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      // Fetch all articles
      const articlesRef = collection(db, "articles");
      const queryAllArticles = query(articlesRef, orderBy("timestamp", "desc"));
      const articlesSnapshot = await getDocs(queryAllArticles);

      const pendingDocs: Article[] = [];
      const currentIssueDocs: Article[] = [];
      
      // Process each article
      articlesSnapshot.forEach((doc) => {
        const data = doc.data();
        const article = {
          id: doc.id,
          name: data.name,
          authorName: data.authorName,
          downloadURL: data.downloadURL,
          timestamp: data.timestamp.toDate(),
          fileType: data.fileType,
          status: data.status || "pending",
          undertakingId: data.undertakingId,
          issue: data.issue,
          title: data.title,
          abstract: data.abstract,
          keywords: data.keywords
        };
        
        if (article.status === "approved") {
          currentIssueDocs.push(article);
        } else {
          pendingDocs.push(article);
        }
      });

      // Fetch all undertakings
      const undertakingsRef = collection(db, "undertakings");
      const undertakingsSnapshot = await getDocs(undertakingsRef);
      const undertakingsMap: { [key: string]: Undertaking } = {};
      
      undertakingsSnapshot.forEach((doc) => {
        const data = doc.data();
        undertakingsMap[doc.id] = {
          id: doc.id,
          name: data.name,
          authorName: data.authorName,
          downloadURL: data.downloadURL,
          timestamp: data.timestamp.toDate(),
          fileType: data.fileType,
          status: data.status || "pending",
          articleId: data.articleId
        };
      });
      
      setPendingArticles(pendingDocs);
      setCurrentIssueArticles(currentIssueDocs);
      setUndertakings(undertakingsMap);
      
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateIssueTitle = async () => {
    try {
      const titleRef = collection(db, "currentIssue");
      const titleDoc = await getDocs(titleRef);
      
      if (titleDoc.empty) {
        // Create new document if it doesn't exist
        await addDoc(titleRef, { title: currentIssueTitle });
      } else {
        // Update existing document
        await updateDoc(doc(db, "currentIssue", titleDoc.docs[0].id), {
          title: currentIssueTitle
        });
      }
      
      setIsEditingTitle(false);
      toast.success("Current issue title updated successfully");
    } catch (error) {
      console.error("Error updating current issue title:", error);
      toast.error("Failed to update current issue title");
    }
  };

  const handleViewDocument = (article: Article, initialTab: 'article' | 'undertaking' = 'article') => {
    setViewingDocument(article);
  };

  const handleCloseViewer = () => {
    setViewingDocument(null);
  };

  const handleApproveClick = (article: Article) => {
    setSelectedArticle(article);
    setShowApprovalModal(true);
  };

  const handleApproveSubmission = async () => {
    if (!selectedArticle) return;
    
    try {
      const articleRef = doc(db, "articles", selectedArticle.id);
      
      // Update article status to approved
      await updateDoc(articleRef, {
        status: "approved",
        issue: "current",
        approvedDate: new Date()
      });
      
      toast.success(`"${selectedArticle.title || selectedArticle.name}" has been approved and added to current issue`);
      setShowApprovalModal(false);
      
      // Refresh submissions list
      fetchSubmissions();
      
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("Failed to approve submission");
    }
  };

  const handleRejectSubmission = async (article: Article) => {
    const message = `Are you sure you want to delete "${article.name}"?`;
      
    if (!confirm(message)) {
      return;
    }
    
    try {
      // Delete both article and undertaking documents
      await deleteDoc(doc(db, "articles", article.id));
      await deleteDoc(doc(db, "undertakings", article.undertakingId));
      
      toast.success(`"${article.name}" has been rejected and deleted`);
      
      // Refresh submissions list
      fetchSubmissions();
      
    } catch (error) {
      console.error("Error removing submission:", error);
      toast.error("Failed to remove submission");
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

  const handleRevertToPending = async (article: Article) => {
    const message = `Are you sure you want to move "${article.title || article.name}" back to pending submissions?`;
      
    if (!confirm(message)) {
      return;
    }
    
    try {
      const articleRef = doc(db, "articles", article.id);
      
      // Update article status back to 'pending' and remove from current issue
      await updateDoc(articleRef, {
        status: "pending",
        issue: null,
        approvedDate: null,
        title: null,
        abstract: null,
        keywords: null
      });
      
      toast.success(`"${article.title || article.name}" has been moved back to pending submissions`);
      
      // Refresh submissions list
      fetchSubmissions();
      
    } catch (error) {
      console.error("Error reverting submission:", error);
      toast.error("Failed to revert submission status");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const toggleArticleDetails = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  const renderSubmissionsList = (articles: Article[]) => {
    if (articles.length === 0) {
      return (
        <div className="text-center py-12 bg-[var(--background)] rounded-lg">
          <p className="text-[var(--secondary-text)]">
            No {activeTab === "pending" ? "pending" : "current issue"} submissions found.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border)]">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                Document
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                Author
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                Date Uploaded
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--background)]">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[var(--foreground)]">{article.name}</div>
                  <div className="text-xs text-[var(--secondary-text)]">{article.fileType}</div>
                  {activeTab === "current" && article.title && (
                    <button
                      onClick={() => toggleArticleDetails(article.id)}
                      className="mt-2 text-xs text-[var(--accent)] hover:underline"
                    >
                      {expandedArticle === article.id ? 'Hide Details' : 'Show Details'}
                    </button>
                  )}
                  {activeTab === "current" && expandedArticle === article.id && article.title && (
                    <div className="mt-2 p-3 bg-[var(--secondary-background)] rounded-md">
                      <div className="mb-2">
                        <span className="font-medium">Title:</span>
                        <p className="text-sm">{article.title}</p>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Abstract:</span>
                        <p className="text-sm">{article.abstract}</p>
                      </div>
                      <div>
                        <span className="font-medium">Keywords:</span>
                        <p className="text-sm">{article.keywords}</p>
                      </div>
                    </div>
                  )}
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
                  {activeTab === "pending" ? (
                    <>
                      <button
                        onClick={() => handleViewDocument(article, 'article')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        View Article
                      </button>
                      <button
                        onClick={() => handleViewDocument(article, 'undertaking')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        View Undertaking
                      </button>
                      <button
                        onClick={() => handleApproveClick(article)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        Approve
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDownload(article)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleMoveToArchiveClick(article)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
                      >
                        Move to Archive
                      </button>
                      <button
                        onClick={() => handleRevertToPending(article)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                        title="Move back to pending submissions"
                      >
                        Revert to Pending
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const fetchArchives = async () => {
    try {
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
    }
  };

  const handleCreateArchive = async () => {
    if (!newArchiveName.trim()) {
      toast.error("Please enter an archive name");
      return;
    }
    
    try {
      const archivesRef = collection(db, "archives");
      await addDoc(archivesRef, {
        name: newArchiveName,
        createdAt: new Date()
      });
      
      setShowCreateArchiveModal(false);
      setNewArchiveName("");
      toast.success("Archive created successfully");
      fetchArchives();
    } catch (error) {
      console.error("Error creating archive:", error);
      toast.error("Failed to create archive");
    }
  };

  const handleMoveToArchive = async (article: Article) => {
    if (!selectedArchive) {
      toast.error("Please select an archive");
      return;
    }
    
    try {
      const articleRef = doc(db, "articles", article.id);
      await updateDoc(articleRef, {
        issue: "archived",
        archiveName: selectedArchive
      });
      
      setShowMoveToArchiveModal(false);
      setSelectedArchive("");
      toast.success(`Article moved to ${selectedArchive} archive`);
      fetchSubmissions();
      fetchArchives();
    } catch (error) {
      console.error("Error moving article to archive:", error);
      toast.error("Failed to move article to archive");
    }
  };

  const handleMoveToArchiveClick = (article: Article) => {
    setSelectedArticle(article);
    setShowMoveToArchiveModal(true);
  };

  const handleRevertFromArchive = async (article: Article) => {
    const message = `Are you sure you want to move "${article.title || article.name}" back to current issue?`;
      
    if (!confirm(message)) {
      return;
    }
    
    try {
      const articleRef = doc(db, "articles", article.id);
      await updateDoc(articleRef, {
        issue: "current",
        archiveName: null
      });
      
      toast.success(`"${article.title || article.name}" has been moved back to current issue`);
      fetchSubmissions();
      fetchArchives();
    } catch (error) {
      console.error("Error reverting article from archive:", error);
      toast.error("Failed to revert article from archive");
    }
  };

  const handleDeleteArchive = async (archive: Archive) => {
    const message = `Are you sure you want to delete the archive "${archive.name}"? This will also remove all articles in this archive.`;
      
    if (!confirm(message)) {
      return;
    }
    
    try {
      // First, get all articles in this archive
      const articlesRef = collection(db, "articles");
      const articlesSnapshot = await getDocs(articlesRef);
      
      // Update all articles in this archive to remove archiveName
      const updatePromises = articlesSnapshot.docs
        .filter(doc => doc.data().archiveName === archive.name)
        .map(doc => updateDoc(doc.ref, {
          archiveName: null,
          issue: "current" // Move articles back to current issue
        }));
      
      // Delete the archive document
      const deletePromise = deleteDoc(doc(db, "archives", archive.id));
      
      // Execute all updates and delete
      await Promise.all([...updatePromises, deletePromise]);
      
      toast.success(`Archive "${archive.name}" has been deleted and its articles moved to current issue`);
      fetchSubmissions();
      fetchArchives();
    } catch (error) {
      console.error("Error deleting archive:", error);
      toast.error("Failed to delete archive");
    }
  };

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          {/* Current Issue Title Section */}
          <div className="mb-8 bg-[var(--background)] shadow-md rounded-lg border border-[var(--border)] p-6">
            <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Current Issue Title</h2>
            {isEditingTitle ? (
              <div className="flex gap-4">
                <input
                  type="text"
                  value={currentIssueTitle}
                  onChange={(e) => setCurrentIssueTitle(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-md bg-[var(--secondary-background)] text-[var(--foreground)]"
                  placeholder="Enter current issue title"
                />
                <button
                  onClick={handleUpdateIssueTitle}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="px-4 py-2 border rounded-md hover:bg-[var(--secondary-background)]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-[var(--foreground)]">{currentIssueTitle || "No title set"}</p>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-opacity-90"
                >
                  Edit Title
                </button>
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <div className="border-b border-[var(--border)] mb-6">
            <div className="flex space-x-6">
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === "pending"
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--secondary-text)] hover:text-[var(--foreground)]"
                } transition-colors`}
                onClick={() => setActiveTab("pending")}
              >
                Pending Submissions
              </button>
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === "current"
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--secondary-text)] hover:text-[var(--foreground)]"
                } transition-colors`}
                onClick={() => setActiveTab("current")}
              >
                Current Issue
              </button>
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === "archives"
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--secondary-text)] hover:text-[var(--foreground)]"
                } transition-colors`}
                onClick={() => setActiveTab("archives")}
              >
                Archives
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-[var(--accent)] rounded-full border-t-transparent"></div>
            </div>
          ) : activeTab === "archives" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Archives</h2>
                <button
                  onClick={() => setShowCreateArchiveModal(true)}
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-opacity-90"
                >
                  Create Archive
                </button>
              </div>
              
              {archives.length === 0 ? (
                <div className="text-center py-12 bg-[var(--background)] rounded-lg">
                  <p className="text-[var(--secondary-text)]">No archives created yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {archives.map((archive) => (
                    <div key={archive.id} className="bg-[var(--background)] shadow-md rounded-lg border border-[var(--border)] overflow-hidden">
                      <div className="p-4 border-b border-[var(--border)]">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-[var(--foreground)]">{archive.name}</h3>
                            <p className="text-sm text-[var(--secondary-text)]">
                              Created on {archive.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteArchive(archive)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:underline"
                            title="Delete archive and move articles to current issue"
                          >
                            Delete Archive
                          </button>
                        </div>
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
                                  <td className="px-4 py-4 whitespace-nowrap space-x-2">
                                    <button
                                      onClick={() => handleDownload(article)}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                                    >
                                      Download
                                    </button>
                                    <button
                                      onClick={() => handleRevertFromArchive(article)}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
                                      title="Move back to current issue"
                                    >
                                      Revert
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-[var(--secondary-text)]">
                          No articles in this archive yet.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[var(--background)] shadow-md rounded-lg border border-[var(--border)] overflow-hidden">
              {activeTab === "pending" ? renderSubmissionsList(pendingArticles) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--border)]">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                          Date Uploaded
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--secondary-text)] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {currentIssueArticles.map((article) => (
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
                            <button
                              onClick={() => handleDownload(article)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => handleMoveToArchiveClick(article)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
                            >
                              Move to Archive
                            </button>
                            <button
                              onClick={() => handleRevertToPending(article)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                              title="Move back to pending submissions"
                            >
                              Revert to Pending
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
        
        {viewingDocument && (
          <DocumentViewer
            documentUrl={viewingDocument.downloadURL}
            fileName={viewingDocument.name}
            undertakingUrl={undertakings[viewingDocument.undertakingId]?.downloadURL}
            undertakingName={undertakings[viewingDocument.undertakingId]?.name}
            onClose={handleCloseViewer}
          />
        )}
        
        {showApprovalModal && selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--background)] rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Approve Submission</h3>
              <p className="mb-4 text-[var(--secondary-text)]">
                Are you sure you want to approve this submission? The article will be added to the current issue.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-[var(--secondary-background)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveSubmission}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Create Archive Modal */}
        {showCreateArchiveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--background)] p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Archive</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Archive Name</label>
                  <input
                    type="text"
                    value={newArchiveName}
                    onChange={(e) => setNewArchiveName(e.target.value)}
                    className="w-full p-2 border rounded-md bg-[var(--secondary-background)]"
                    placeholder="Enter archive name"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCreateArchiveModal(false)}
                    className="px-4 py-2 border rounded-md hover:bg-[var(--secondary-background)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateArchive}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={!newArchiveName.trim()}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Move to Archive Modal */}
        {showMoveToArchiveModal && selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--background)] p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Move to Archive</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Archive</label>
                  <select
                    value={selectedArchive}
                    onChange={(e) => setSelectedArchive(e.target.value)}
                    className="w-full p-2 border rounded-md bg-[var(--secondary-background)]"
                  >
                    <option value="">Select an archive</option>
                    {archives.map((archive) => (
                      <option key={archive.id} value={archive.name}>
                        {archive.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowMoveToArchiveModal(false)}
                    className="px-4 py-2 border rounded-md hover:bg-[var(--secondary-background)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleMoveToArchive(selectedArticle)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={!selectedArchive}
                  >
                    Move
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 