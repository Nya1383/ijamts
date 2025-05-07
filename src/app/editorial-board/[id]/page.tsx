"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type BoardMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  order?: number;
  imageUrl?: string;
  email?: string;
  department?: string;
  institution?: string;
  researchInterests?: string[];
  publications?: string[];
  education?: string[];
};

export default function BoardMemberPage() {
  const params = useParams();
  const [member, setMember] = useState<BoardMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "boardMembers", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMember({ id: docSnap.id, ...docSnap.data() } as BoardMember);
        } else {
          setError("Member not found");
        }
      } catch (err) {
        console.error("Error fetching member:", err);
        setError("Failed to load member details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMember();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading member details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-semibold mt-4">{error || "Member not found"}</h2>
            </div>
            <Link
              href="/editorial-board"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Back to Editorial Board
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/editorial-board"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Editorial Board
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-48 h-48 relative rounded-full overflow-hidden bg-gray-200">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h1>
                <p className="text-xl text-blue-600 dark:text-blue-400 mb-4">{member.role}</p>
                
                {member.department && member.institution && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {member.department}, {member.institution}
                  </p>
                )}
                
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {member.email}
                  </a>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Biography</h2>
                <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
              </div>

              {member.researchInterests && member.researchInterests.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Research Interests</h2>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    {member.researchInterests.map((interest, index) => (
                      <li key={index}>{interest}</li>
                    ))}
                  </ul>
                </div>
              )}

              {member.education && member.education.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Education</h2>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    {member.education.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))}
                  </ul>
                </div>
              )}

              {member.publications && member.publications.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Selected Publications</h2>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    {member.publications.map((pub, index) => (
                      <li key={index}>{pub}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 