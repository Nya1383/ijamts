"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

type BoardMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  order?: number;
  imageUrl?: string;
};

export default function EditorialBoardPage() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackTriggered, setFallbackTriggered] = useState(false);

  // Fallback data in case Firestore fetch fails
  const fallbackBoardMembers: BoardMember[] = [
    {
      id: "1",
      name: "Dr. M.V. Ramana Murthy",
      role: "Associate Editor",
      bio: "M.Sc., Ph.D., Rtd. Professor, Department of Mathematics, Osmania University. Dr. Murthy brings extensive experience in mathematical research and academic publishing to the editorial board.",
      order: 1
    },
    {
      id: "2",
      name: "Prof. Dr S Jeelan",
      role: "Associate Editor",
      bio: "Professor in Management, Director, CDVL at Central University. Prof. Jeelan specializes in management studies and brings valuable expertise in leadership and academic administration.",
      order: 2
    },
    {
      id: "3",
      name: "Dr. Review Committee",
      role: "Reviewer",
      bio: "Our dedicated review committee ensures the highest standards of academic rigor and quality in all published research.",
      order: 3
    },
  ];

  // Function to generate initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word && word[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'XX';
  };

  // Generate random color based on ID
  const getBackgroundColor = (id: string): string => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-pink-500", "bg-indigo-500", "bg-yellow-500"
    ];
    // Handle non-integer IDs safely with a stable hash
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Memoized fetch function to prevent recreation on every render
  const fetchBoardMembers = useCallback(async () => {
    // Initialize a reference to the timeout ID outside the try block
    let fetchTimeoutId: NodeJS.Timeout | null = null;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching board members from Firestore...");
      
      // Create a simple query without orderBy
      const boardMembersRef = collection(db, "boardMembers");
      const q = query(boardMembersRef, limit(20));
      
      // Set a timeout to show fallback data if fetch takes too long
      fetchTimeoutId = setTimeout(() => {
        console.log("Firestore fetch timeout, using fallback data");
        setBoardMembers(fallbackBoardMembers);
        setLoading(false);
        setFallbackTriggered(true);
        toast.error("Loading took too long. Using cached data instead.");
      }, 5000); // 5-second timeout
      
      const querySnapshot = await getDocs(q);
      
      // Clear timeout since we got response
      if (fetchTimeoutId) {
        clearTimeout(fetchTimeoutId);
        fetchTimeoutId = null;
      }
      
      // Process the data
      const members: BoardMember[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<BoardMember, "id">;
        members.push({
          id: doc.id,
          name: data.name || "Unknown",
          role: data.role || "Board Member",
          bio: data.bio || "",
          order: data.order || 999,
          imageUrl: data.imageUrl,
        });
      });
      
      console.log(`Found ${members.length} board members in Firestore`);
      
      if (members.length > 0) {
        // Sort members by order field manually
        members.sort((a, b) => (a.order || 999) - (b.order || 999));
        setBoardMembers(members);
      } else {
        console.log("No board members found in Firestore, using fallback data");
        setBoardMembers(fallbackBoardMembers);
        setFallbackTriggered(true);
        toast.error("No board members found. Displaying sample data.");
      }
      
    } catch (err) {
      console.error("Error fetching board members:", err);
      
      // Clear timeout if it exists
      if (fetchTimeoutId) {
        clearTimeout(fetchTimeoutId);
        fetchTimeoutId = null;
      }
      
      // Check for specific Firestore errors
      let errorMessage = "Failed to load editorial board members. Please try again later.";
      const error = err as Error;
      
      if (error.message.includes("requires an index")) {
        console.error("Missing Firestore index. Follow the Firebase console link to create it.");
        errorMessage = "Database configuration issue. Please check Firestore indexes.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (error.message.includes("permission-denied")) {
        errorMessage = "Access denied. Please check Firestore security rules.";
      }
      
      setError(errorMessage);
      setBoardMembers(fallbackBoardMembers);
      setFallbackTriggered(true);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Remove all unnecessary dependencies

  // Only fetch data on mount
  useEffect(() => {
    let isMounted = true;
    
    console.log("Editorial board component mounted");
    
    const loadData = async () => {
      try {
        await fetchBoardMembers();
      } catch (err) {
        if (isMounted) {
          console.error("Unhandled error in fetchBoardMembers:", err);
          setError("An unexpected error occurred. Please try again later.");
          setBoardMembers(fallbackBoardMembers);
          setLoading(false);
        }
      }
    };
    
    // Only try Firestore if we haven't already fallen back to static data
    if (!fallbackTriggered) {
      loadData();
    }
    
    // Cleanup function to prevent state updates if component unmounts during fetch
    return () => {
      isMounted = false;
      console.log("Editorial board component unmounted");
    };
  }, [fetchBoardMembers, fallbackTriggered]);

  // Loading state JSX
  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading editorial board members...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state JSX
  if (error && boardMembers.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-semibold mt-4">{error}</h2>
            </div>
            <button
              onClick={() => fetchBoardMembers()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">Editorial Board</h1>
        
        {/* Group members by role */}
        {/* Associate Editors Section */}
        {boardMembers.filter(member => member.role === "Associate Editor").length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 border-b-2 border-[var(--accent)] pb-2">
              Associate Editors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers
                .filter(member => member.role === "Associate Editor")
                .map((member) => (
                <Link
                  key={member.id}
                  href={`/editorial-board/${member.id}`}
                  className="group h-full"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${getBackgroundColor(member.id)} text-white text-2xl font-bold`}>
                            {getInitials(member.name)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                          {member.name}
                        </h2>
                        <p className="text-blue-600 dark:text-blue-400 text-center mb-3">
                          {member.role}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 flex-grow">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviewers Section */}
        {boardMembers.filter(member => member.role === "Reviewer").length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 border-b-2 border-[var(--accent)] pb-2">
              Reviewers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers
                .filter(member => member.role === "Reviewer")
                .map((member) => (
                <Link
                  key={member.id}
                  href={`/editorial-board/${member.id}`}
                  className="group h-full"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${getBackgroundColor(member.id)} text-white text-2xl font-bold`}>
                            {getInitials(member.name)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                          {member.name}
                        </h2>
                        <p className="text-blue-600 dark:text-blue-400 text-center mb-3">
                          {member.role}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 flex-grow">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Roles Section (if any) */}
        {boardMembers.filter(member => member.role !== "Associate Editor" && member.role !== "Reviewer").length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 border-b-2 border-[var(--accent)] pb-2">
              Other Board Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers
                .filter(member => member.role !== "Associate Editor" && member.role !== "Reviewer")
                .map((member) => (
                <Link
                  key={member.id}
                  href={`/editorial-board/${member.id}`}
                  className="group h-full"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${getBackgroundColor(member.id)} text-white text-2xl font-bold`}>
                            {getInitials(member.name)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                          {member.name}
                        </h2>
                        <p className="text-blue-600 dark:text-blue-400 text-center mb-3">
                          {member.role}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 flex-grow">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 