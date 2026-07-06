// ─────────────────────────────────────────
// ConfirmationCard
// Shows AI-extracted task details
// All fields are editable before saving
// Confirm saves to calendar
// Cancel goes back to capture
// ─────────────────────────────────────────

import { useState } from "react";
import TaskField from "./TaskField";
import PrioritySelector from "./PrioritySelector";

export default function ConfirmationCard({ data, onConfirm, onCancel, loading }) {
  // ── editable state — pre-filled from AI extraction ──
  const [task, setTask] = useState(data?.title || "");
  const [date, setDate] = useState(data?.start_datetime?.split("T")[0] || "");
  const [time, setTime] = useState(data?.start_datetime?.split("T")[1]?.slice(0, 5) || "");
  const [priority, setPriority] = useState(data?.priority || "medium");

  const handleConfirm = () => {
    onConfirm({ task, date, time, priority });
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-100 overflow-hidden">

      {/* ── card header ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Review & Confirm</h2>
            <p className="text-indigo-200 text-sm">
              AI extracted these details — edit anything before saving
            </p>
          </div>
        </div>
      </div>

      {/* ── fields ── */}
      <div className="px-8 py-6 flex flex-col gap-6">

        {/* task name */}
        <TaskField label="Task" icon="📋">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </TaskField>

        {/* date and time — side by side */}
        <div className="grid grid-cols-2 gap-4">
          <TaskField label="Date" icon="📅">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </TaskField>

          <TaskField label="Time" icon="🕐">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </TaskField>
        </div>

        {/* priority */}
        <TaskField label="Priority" icon="🎯">
          <PrioritySelector value={priority} onChange={setPriority} />
        </TaskField>

        {/* reminder note */}
        <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-4 py-3">
          <span className="text-lg">🔔</span>
          <p className="text-indigo-700 text-sm">
            You'll get a reminder 30 minutes before this event
          </p>
        </div>
      </div>

      {/* ── action buttons ── */}
      <div className="px-8 pb-8 flex flex-col gap-3">
        <button
          onClick={handleConfirm}
          disabled={loading || !task || !date || !time}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving to Calendar...
            </>
          ) : (
            <>
              <span>📅</span>
              Save to Google Calendar
            </>
          )}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="w-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-600 py-3 rounded-xl font-medium text-sm transition-all"
        >
          ← Record again
        </button>
      </div>
    </div>
  );
}