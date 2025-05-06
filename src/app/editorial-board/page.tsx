"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "react-hot-toast";

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
      name: "Dr. Jane Smith",
      role: "Editor-in-Chief",
      bio: "Dr. Smith is a Professor of Literature with over 15 years of experience in academic publishing. Her research focuses on comparative literature and modern poetry.",
      order: 1
    },
    {
      id: "2",
      name: "Prof. Michael Johnson",
      role: "Associate Editor",
      bio: "Professor Johnson specializes in creative writing and contemporary fiction. He has published numerous articles and books on narrative techniques.",
      order: 2
    },
    {
      id: "3",
      name: "Dr. Sarah Williams",
      role: "Managing Editor",
      bio: "Dr. Williams has expertise in digital humanities and publishing technologies. She oversees the journal's publication process and digital presence.",
      order: 3
    },
    {
      id: "4",
      name: "Prof. David Chen",
      role: "Review Editor",
      bio: "Professor Chen's background is in literary criticism and theory. He coordinates the peer review process for all submissions.",
      order: 4
    },
    {
      id: "5",
      name: "Dr. Amina Patel",
      role: "Board Member",
      bio: "Dr. Patel specializes in world literature and postcolonial studies. She brings a global perspective to the editorial board.",
      order: 5
    },
    {
      id: "6",
      name: "Prof. Robert Garcia",
      role: "Board Member",
      bio: "Professor Garcia's research focuses on poetry and literary translation. He has translated numerous works from Spanish to English.",
      order: 6
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
        {fallbackTriggered && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-200">
            <p>Displaying cached data. Some information may not be up to date.</p>
          </div>
        )}
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            About Our Board
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our editorial board consists of distinguished scholars and practitioners in the fields of management, 
            technology, and science. Board members are responsible for maintaining the high standards of our
            journal and ensuring that published works contribute meaningfully to academic and practical discourse.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            The board meets quarterly to review the journal's direction, discuss upcoming special issues,
            and evaluate the peer review process. Members serve renewable three-year terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boardMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-48 ${getBackgroundColor(member.id)} flex items-center justify-center`}>
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(member.name)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Join Our Board</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We periodically invite qualified individuals to join our editorial board. If you are interested
            in becoming a board member, please send your CV and a letter of interest to our editorial office.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
} 