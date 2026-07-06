// ─────────────────────────────────────────
// PrioritySelector
// Visual priority picker — low/medium/high
// Shows colored badges instead of plain dropdown
// ─────────────────────────────────────────

const PRIORITIES = [
  {
    value: "low",
    label: "Low",
    color: "bg-green-100 text-green-700 border-green-200",
    activeColor: "bg-green-500 text-white border-green-500",
    dot: "bg-green-500",
  },
  {
    value: "medium",
    label: "Medium",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    activeColor: "bg-yellow-500 text-white border-yellow-500",
    dot: "bg-yellow-500",
  },
  {
    value: "high",
    label: "High",
    color: "bg-red-100 text-red-700 border-red-200",
    activeColor: "bg-red-500 text-white border-red-500",
    dot: "bg-red-500",
  },
];

export default function PrioritySelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {PRIORITIES.map((priority) => {
        const isActive = value === priority.value;
        return (
          <button
            key={priority.value}
            type="button"
            onClick={() => onChange(priority.value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl
              border text-sm font-medium transition-all
              ${isActive ? priority.activeColor : priority.color}
            `}
          >
            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : priority.dot}`} />
            {priority.label}
          </button>
        );
      })}
    </div>
  );
}