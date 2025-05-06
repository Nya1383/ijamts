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

type SubmissionFile = {
  id: string;
  name: string;
  authorName: string;
  downloadURL: string;
  timestamp: Date;
  fileType: string;
  status?: string;
};

export default function AdminDashboard() {
  const [pendingSubmissions, setPendingSubmissions] = useState<SubmissionFile[]>([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState<SubmissionFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDocument, setViewingDocument] = useState<SubmissionFile | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      // Fetch all submissions first
      const filesRef = collection(db, "uploadedFiles");
      const queryAllFiles = query(filesRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(queryAllFiles);

      const allFiles: SubmissionFile[] = [];
      const pendingDocs: SubmissionFile[] = [];
      const approvedDocs: SubmissionFile[] = [];
      
      // Process each document
      snapshot.forEach((doc) => {
        const data = doc.data();
        const file = {
          id: doc.id,
          name: data.name,
          authorName: data.authorName,
          downloadURL: data.downloadURL,
          timestamp: data.timestamp.toDate(),
          fileType: data.fileType,
          status: data.status || "pending",
        };
        
        allFiles.push(file);
        
        // Sort into appropriate category
        if (file.status === "approved") {
          approvedDocs.push(file);
        } else {
          pendingDocs.push(file);
        }
      });
      
      setPendingSubmissions(pendingDocs);
      setApprovedSubmissions(approvedDocs);
      
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (file: SubmissionFile) => {
    setViewingDocument(file);
  };

  const handleCloseViewer = () => {
    setViewingDocument(null);
  };

  const handleApproveSubmission = async (file: SubmissionFile) => {
    try {
      const fileRef = doc(db, "uploadedFiles", file.id);
      
      // Update the status to 'approved'
      await updateDoc(fileRef, {
        status: "approved",
      });
      
      toast.success(`"${file.name}" has been approved`);
      
      // Refresh submissions list
      fetchSubmissions();
      
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("Failed to approve submission");
    }
  };

  const handleRejectSubmission = async (file: SubmissionFile, isApproved = false) => {
    const action = isApproved ? "remove from archives" : "reject and delete";
    const message = isApproved 
      ? `Are you sure you want to remove "${file.name}" from the archives? This will permanently delete the submission.`
      : `Are you sure you want to delete "${file.name}"?`;
      
    if (!confirm(message)) {
      return;
    }
    
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, "uploadedFiles", file.id));
      
      const successMessage = isApproved
        ? `"${file.name}" has been removed from archives`
        : `"${file.name}" has been rejected and deleted`;
        
      toast.success(successMessage);
      
      // Refresh submissions list
      fetchSubmissions();
      
    } catch (error) {
      console.error("Error removing submission:", error);
      toast.error("Failed to remove submission");
    }
  };

  const handleRevertToPending = async (file: SubmissionFile) => {
    try {
      const fileRef = doc(db, "uploadedFiles", file.id);
      
      // Update the status back to 'pending'
      await updateDoc(fileRef, {
        status: "pending",
      });
      
      toast.success(`"${file.name}" has been moved back to pending submissions`);
      
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

  const renderSubmissionsList = (submissions: SubmissionFile[]) => {
    if (submissions.length === 0) {
      return (
        <div className="text-center py-12 bg-[var(--background)] rounded-lg">
          <p className="text-[var(--secondary-text)]">
            No {activeTab} submissions found.
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
            {submissions.map((file) => (
              <tr key={file.id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[var(--foreground)]">{file.name}</div>
                  <div className="text-xs text-[var(--secondary-text)]">{file.fileType}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--foreground)]">{file.authorName}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--foreground)]">
                    {file.timestamp.toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleViewDocument(file)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    View
                  </button>
                  
                  {activeTab === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApproveSubmission(file)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectSubmission(file, false)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRevertToPending(file)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
                        title="Move back to pending submissions for review"
                      >
                        Revert to Pending
                      </button>
                      <button
                        onClick={() => handleRejectSubmission(file, true)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                        title="Permanently remove this document from archives"
                      >
                        Remove
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
                  activeTab === "approved"
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--secondary-text)] hover:text-[var(--foreground)]"
                } transition-colors`}
                onClick={() => setActiveTab("approved")}
              >
                Approved Submissions
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-[var(--accent)] rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="bg-[var(--background)] shadow-md rounded-lg border border-[var(--border)] overflow-hidden">
              {activeTab === "pending" ? renderSubmissionsList(pendingSubmissions) : renderSubmissionsList(approvedSubmissions)}
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
    </ProtectedRoute>
  );
} 