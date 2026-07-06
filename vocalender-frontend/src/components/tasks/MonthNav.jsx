// ─────────────────────────────────────────
// MonthNav
// Previous / Next month navigation header
// Shows current month and year
// ─────────────────────────────────────────

export default function MonthNav({ currentDate, onPrev, onNext }) {
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900">{monthName}</h2>
      <div className="flex items-center gap-2">
        {/* previous month */}
        <button
          onClick={onPrev}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* today button */}
        <button
          onClick={() => onPrev(true)}
          className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold transition-all"
        >
          Today
        </button>

        {/* next month */}
        <button
          onClick={onNext}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}