export default function MaintenanceMode() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">Under Maintenance</h1>
        <p className="text-xl text-[var(--secondary-text)] mb-8">
          We are currently performing scheduled maintenance. Please check back later.
        </p>
        <div className="animate-spin h-12 w-12 border-4 border-[var(--accent)] rounded-full border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
} 