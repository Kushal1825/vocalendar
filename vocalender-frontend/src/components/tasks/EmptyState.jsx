// ─────────────────────────────────────────
// EmptyState
// Shown when user has no tasks yet
// Encourages them to capture their first task
// ─────────────────────────────────────────

import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center">

      {/* ── illustration ── */}
      <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-5xl">
        📅
      </div>

      {/* ── message ── */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-gray-900">No tasks yet</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Capture your first task by speaking — it takes less than 10 seconds.
        </p>
      </div>

      {/* ── CTA ── */}
      <button
        onClick={() => navigate(ROUTES.CAPTURE)}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
      >
        🎙️ Capture first task
      </button>
    </div>
  );
}