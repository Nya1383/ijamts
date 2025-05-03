export default function Footer() {
  return (
    <footer className="bg-[var(--secondary-background)] mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h4 className="text-[var(--foreground)] font-semibold mb-4">About the Journal</h4>
            <p className="text-sm text-[var(--secondary-text)] mb-4">
              International Journal of Advanced Methods in Technology Studies (IJAMTS) is a peer-reviewed, open access journal
              dedicated to publishing high-quality research in various fields of science and technology.
            </p>
            <p className="text-sm text-[var(--secondary-text)]">
              The journal aims to facilitate the exchange of cutting-edge research and technology advancements
              across disciplines.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-[var(--foreground)] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Editorial Board", href: "/editorial-board" },
                { name: "Archives", href: "/archives" },
                { name: "Submission Guidelines", href: "/instructions" },
                { name: "Submit Your Paper", href: "/submission" },
                { name: "Publication Ethics", href: "/ethics" },
                { name: "Indexing & Metrics", href: "/indexing" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--secondary-text)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-[var(--foreground)] font-semibold mb-4">Contact Information</h4>
            <ul className="space-y-2 text-sm text-[var(--secondary-text)]">
              <li className="flex items-start space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>editor@ijamtsjournal.org</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  IJAMTS Publishing House,
                  <br />
                  123 Academic Avenue,
                  <br />
                  Research City, 54321
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Journal Metrics */}
          <div>
            <h4 className="text-[var(--foreground)] font-semibold mb-4">Journal Metrics</h4>
            <div className="bg-[var(--background)] p-4 rounded-lg shadow-sm text-center mb-4 border border-[var(--border)]">
              <div className="text-xs uppercase text-[var(--muted-text)]">Impact Factor</div>
              <div className="text-3xl font-bold text-[var(--accent)]">2.8</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--secondary-text)]">Acceptance Rate</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--secondary-text)]">Review Time</span>
                <span className="text-sm font-medium">4-6 weeks</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--secondary-text)]">Publication Frequency</span>
                <span className="text-sm font-medium">Quarterly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="bg-[var(--accent)] text-[var(--background)] py-4">
        <div className="container text-center text-sm">
          <p>
            © {new Date().getFullYear()} International Journal of Advanced Methods in Technology Studies. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 