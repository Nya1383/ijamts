"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isEditorialOpen, setIsEditorialOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubmission = () => {
    setIsSubmissionOpen(!isSubmissionOpen);
  };

  const toggleEditorial = () => {
    setIsEditorialOpen(!isEditorialOpen);
  };

  const submissionItems = [
    { name: "Submit Your Article", href: "/submission" },
    { name: "Publication Guidelines", href: "/submission/guidelines" },
    { name: "Paper Article Fee", href: "/submission/fee" },
    { name: "Track Article Status", href: "/submission/track" },
    { name: "Article Ethics", href: "/submission/ethics" },
  ];

  const editorialItems = [
    { name: "Editorial Board", href: "/editorial-board" },
    { name: "Join as Reviewer", href: "/editorial-board/join" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      <div className="bg-[var(--secondary-background)] text-[var(--foreground)]">
        <div className="container flex justify-between items-center py-3">
          <div className="flex items-center">
            <div className="mr-4 relative w-10 h-10">
              <Image src="/logo.png" alt="IJAMTS Logo" width={40} height={40} />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-lg font-semibold">International Journal of Advances in Management, Technology and Science</div>
            <div className="text-sm text-[var(--secondary-text)]">ISSN: xxxx-xxxx</div>
          </div>
        </div>
      </div>
      <nav className="bg-[var(--background)] border-b border-[var(--border)]">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex space-x-1">
              <Link
                href="/"
                className="px-3 py-4 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                Home
              </Link>
              <div className="relative">
                <button
                  onClick={toggleEditorial}
                  className="px-3 py-4 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors flex items-center"
                >
                  Editorial Board
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 transition-transform ${isEditorialOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isEditorialOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[var(--background)] border border-[var(--border)]">
                    <div className="py-1">
                      {editorialItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary-background)]"
                          onClick={() => setIsEditorialOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={toggleSubmission}
                  className="px-3 py-4 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors flex items-center"
                >
                  Submission
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 transition-transform ${isSubmissionOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isSubmissionOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[var(--background)] border border-[var(--border)]">
                    <div className="py-1">
                      {submissionItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary-background)]"
                          onClick={() => setIsSubmissionOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {[
                { name: "Current Issue", href: "/current-issue" },
                { name: "Archives", href: "/archives" },
                { name: "Conference Proceedings", href: "/proceedings" },
                { name: "Contact Us", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-4 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href="/admin" className="p-2 text-[var(--foreground)] hover:text-[var(--accent)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
              <button
                className="md:hidden text-[var(--foreground)] p-2"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden py-2">
              <Link
                href="/"
                className="block px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-[var(--foreground)]">Editorial Board</div>
                {editorialItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block pl-4 py-2 text-sm text-[var(--foreground)] hover:text-[var(--accent)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-[var(--foreground)]">Submission</div>
                {submissionItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block pl-4 py-2 text-sm text-[var(--foreground)] hover:text-[var(--accent)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              {[
                { name: "Current Issue", href: "/current-issue" },
                { name: "Archives", href: "/archives" },
                { name: "Conference Proceedings", href: "/proceedings" },
                { name: "Contact Us", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
} 