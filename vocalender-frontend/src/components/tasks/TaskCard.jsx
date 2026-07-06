// ─────────────────────────────────────────
// TaskCard
// Single task row in the task list
// Shows task name, date, time, priority
// Edit and delete actions on the right
// ─────────────────────────────────────────

import { useState } from "react";
import { formatShortDate, isPastDate } from "../../utils/formatDate";
import { formatTimeFromDateTime } from "../../utils/formatTime";

const PRIORITY_STYLES = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const PRIORITY_DOTS = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export default function TaskCard({ task, onDelete, onUpdate }) {
  const [deleting, setDeleting] = useState(false);
  const isPast = isPastDate(task.scheduled_at);

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    setDeleting(true);
    await onDelete(task.id);
    setDeleting(false);
  };

  return (
    <div className={`
      bg-white rounded-2xl p-5 flex items-center gap-4
      border border-gray-100 shadow-sm hover:shadow-md
      transition-all group
      ${isPast ? "opacity-60" : ""}
    `}>

      {/* ── priority dot ── */}
      <div className={`
        w-3 h-3 rounded-full flex-shrink-0
        ${PRIORITY_DOTS[task.priority] || PRIORITY_DOTS.medium}
      `} />

      {/* ── task info ── */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-gray-900 truncate ${isPast ? "line-through" : ""}`}>
          {task.task_name}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <span>📅</span>
            {formatShortDate(task.scheduled_at)}
          </span>
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <span>🕐</span>
            {formatTimeFromDateTime(task.scheduled_at)}
          </span>
        </div>
      </div>

      {/* ── priority badge ── */}
      <span className={`
        text-xs px-3 py-1 rounded-full font-medium capitalize flex-shrink-0
        ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}
      `}>
        {task.priority}
      </span>

      {/* ── action buttons ── */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all disabled:opacity-50"
        >
          {deleting ? (
            <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}