"use client";

import { useState } from "react";

type BoardMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

export default function EditorialBoardPage() {
  const [boardMembers] = useState<BoardMember[]>([
    {
      id: "1",
      name: "Dr. Jane Smith",
      role: "Editor-in-Chief",
      bio: "Dr. Smith is a Professor of Literature with over 15 years of experience in academic publishing. Her research focuses on comparative literature and modern poetry.",
      imageUrl: "/images/placeholder-profile.jpg",
    },
    {
      id: "2",
      name: "Prof. Michael Johnson",
      role: "Associate Editor",
      bio: "Professor Johnson specializes in creative writing and contemporary fiction. He has published numerous articles and books on narrative techniques.",
      imageUrl: "/images/placeholder-profile.jpg",
    },
    {
      id: "3",
      name: "Dr. Sarah Williams",
      role: "Managing Editor",
      bio: "Dr. Williams has expertise in digital humanities and publishing technologies. She oversees the journal's publication process and digital presence.",
      imageUrl: "/images/placeholder-profile.jpg",
    },
    {
      id: "4",
      name: "Prof. David Chen",
      role: "Review Editor",
      bio: "Professor Chen's background is in literary criticism and theory. He coordinates the peer review process for all submissions.",
      imageUrl: "/images/placeholder-profile.jpg",
    },
    {
      id: "5",
      name: "Dr. Amina Patel",
      role: "Board Member",
      bio: "Dr. Patel specializes in world literature and postcolonial studies. She brings a global perspective to the editorial board.",
      imageUrl: "/images/placeholder-profile.jpg",
    },
    {
      id: "6",
      name: "Prof. Robert Garcia",
      role: "Board Member",
      bio: "Professor Garcia's research focuses on poetry and literary translation. He has translated numerous works from Spanish to English.",
      imageUrl: "/images/placeholder-profile.jpg",
    },
  ]);

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Editorial Board</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Meet the team behind our literary journal
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            About Our Board
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our editorial board consists of distinguished scholars and practitioners in the field of literature
            and creative writing. Board members are responsible for maintaining the high standards of our
            journal and ensuring that published works contribute meaningfully to literary discourse.
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
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg
                    className="w-16 h-16"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
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