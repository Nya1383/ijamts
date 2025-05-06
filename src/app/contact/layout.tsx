import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - IJAMTS",
  description: "Contact the International Journal of Advances in Management, Technology and Science team",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-[var(--secondary-background)] py-16">
        <div className="container">
          <h1 className="text-4xl font-bold text-[var(--foreground)]">Contact Us</h1>
          <div className="flex items-center mt-4 text-[var(--secondary-text)]">
            <a href="/" className="hover:text-[var(--accent)]">Home</a>
            <span className="mx-2">/</span>
            <span>Contact Us</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
} 