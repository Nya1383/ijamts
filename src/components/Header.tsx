"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
              {[
                { name: "Home", href: "/" },
                { name: "Editorial Board", href: "/editorial-board" },
                { name: "Archives", href: "/archives" },
                { name: "Conference Proceedings", href: "/proceedings" },
                { name: "Instructions", href: "/instructions" },
                { name: "Indexing", href: "/indexing" },
                { name: "Submission", href: "/submission" },
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
          {isMenuOpen && (
            <div className="md:hidden py-2">
              {[
                { name: "Home", href: "/" },
                { name: "Editorial Board", href: "/editorial-board" },
                { name: "Archives", href: "/archives" },
                { name: "Conference Proceedings", href: "/proceedings" },
                { name: "Instructions", href: "/instructions" },
                { name: "Indexing", href: "/indexing" },
                { name: "Submission", href: "/submission" },
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
            </div>
          )}
        </div>
      </nav>
    </header>
  );
} 