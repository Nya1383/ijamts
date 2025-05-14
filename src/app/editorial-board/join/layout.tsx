export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-[calc(100vh-200px)]">
      {children}
    </section>
  );
} 