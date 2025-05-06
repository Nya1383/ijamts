import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Board - IJAMTS",
  description: "Meet the editorial board members of International Journal of Advances in Management, Technology and Science",
};

export default function EditorialBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-[var(--secondary-background)] py-16">
        <div className="container">
          <h1 className="text-4xl font-bold text-[var(--foreground)]">Editorial Board</h1>
          <div className="flex items-center mt-4 text-[var(--secondary-text)]">
            <a href="/" className="hover:text-[var(--accent)]">Home</a>
            <span className="mx-2">/</span>
            <span>Editorial Board</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
} 