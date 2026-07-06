// ─────────────────────────────────────────
// TaskField
// Reusable labeled input field
// Used inside ConfirmationCard for each
// editable task detail (name, date, time)
// ─────────────────────────────────────────

export default function TaskField({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-2">
      {/* ── field label with icon ── */}
      <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <span>{icon}</span>
        {label}
      </label>

      {/* ── field content (input, select, etc.) ── */}
      {children}
    </div>
  );
}