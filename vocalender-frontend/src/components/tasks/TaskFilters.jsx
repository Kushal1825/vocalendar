// ─────────────────────────────────────────
// TaskFilters
// Tab bar to filter tasks by status
// Upcoming / Completed / All
// ─────────────────────────────────────────

const FILTERS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "all", label: "All" },
];

export default function TaskFilters({ active, onChange, counts }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`
            flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all
            ${active === filter.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
            }
          `}
        >
          {filter.label}
          {counts?.[filter.value] > 0 && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              active === filter.value
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-200 text-gray-500"
            }`}>
              {counts[filter.value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}