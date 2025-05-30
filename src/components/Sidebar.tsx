import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="space-y-6">
      {/* Impact Factor */}
      <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 text-center border border-[var(--border)]">
        <div className="flex justify-center mb-2">
          <Image src="/impact-icon.svg" alt="Impact Factor" width={36} height={36} />
        </div>
        <h4 className="text-[var(--foreground)] font-bold mb-2">Impact Factor</h4>
        <div className="text-5xl font-bold text-[var(--accent)]">0.0</div>
        <p className="text-[var(--muted-text)] text-sm mt-2">2023 Journal Citation Reports</p>
      </div>

      {/* Quick Submission */}
      <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
        <div className="flex justify-center mb-4">
          <Image src="/submit-icon.svg" alt="Submit" width={36} height={36} />
        </div>
        <h4 className="text-[var(--foreground)] font-semibold mb-4">Submit Your Research</h4>
        <p className="text-sm text-[var(--secondary-text)] mb-4">
          Ready to publish your work? Submit your manuscript for peer review and publication.
        </p>
        <a
          href="/submission"
          className="btn btn-primary w-full text-center"
        >
          Submit Manuscript
        </a>
      </div>

      {/* Contact Information */}
      <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
        <h4 className="text-[var(--foreground)] font-semibold mb-4">Contact Us</h4>
        <ul className="space-y-3">
          <li className="flex items-center space-x-2 text-sm text-[var(--secondary-text)]">
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
            <span>editor@ijamts.com</span>
          </li>
          <li className="flex items-center space-x-2 text-sm text-[var(--secondary-text)]">
            {/* <svg
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
            </svg> */}
            {/* <span>+1 (555) 123-4567</span> */}
          </li>
        </ul>
      </div>

      {/* Publisher Address */}
      <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
        <h4 className="text-[var(--foreground)] font-semibold mb-4">Publisher</h4>
        <address className="not-italic text-sm text-[var(--secondary-text)]">
          IJAMTS Publishing House
          <br />
          123 Academic Avenue
          <br />
          Research City, 54321
          <br />
          Country
        </address>
      </div>

      {/* Publications Guidelines */}
      <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
        <div className="flex justify-center mb-4">
          <Image src="/archive-icon.svg" alt="Archives" width={36} height={36} />
        </div>
        <h4 className="text-[var(--foreground)] font-semibold mb-4">Publication Guidelines</h4>
        <ul className="space-y-2">
          {[
            { name: "Author Guidelines", href: "/instructions#author" },
            { name: "Manuscript Preparation", href: "/instructions#preparation" },
            { name: "Publication Ethics", href: "/instructions#ethics" },
            { name: "Peer Review Process", href: "/instructions#review" },
            { name: "Article Processing Charges", href: "/instructions#charges" },
          ].map((link) => (
            <li key={link.name} className="text-sm">
              <a
                href={link.href}
                className="flex items-center space-x-2 text-[var(--secondary-text)] hover:text-[var(--accent)] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
} 