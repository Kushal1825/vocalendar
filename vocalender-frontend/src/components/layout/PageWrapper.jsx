// ─────────────────────────────────────────
// PageWrapper
// Consistent max-width and padding
// for all app pages (not landing)
// ─────────────────────────────────────────

export default function PageWrapper({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}