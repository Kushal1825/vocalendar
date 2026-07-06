// ─────────────────────────────────────────
// TasksPage
// Split layout: calendar grid + side panel
// Toggle between calendar and list view
// ─────────────────────────────────────────

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { isPastDate } from "../utils/formatDate";
import { ROUTES } from "../constants/routes";

import Navbar from "../components/layout/Navbar";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskList from "../components/tasks/TaskList";
import CalendarView from "../components/tasks/CalendarView";

export default function TasksPage() {
  const { tasks, loading, error, handleDelete, handleUpdate } = useTasks();
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const [view, setView] = useState("calendar");
  const navigate = useNavigate();

  const counts = {
    upcoming: tasks.filter((t) => !isPastDate(t.scheduled_at)).length,
    completed: tasks.filter((t) => isPastDate(t.scheduled_at)).length,
    all: tasks.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* ── full width container — not narrow PageWrapper ── */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

        {/* ── page header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
            <p className="text-gray-400 text-sm mt-1">
              {tasks.length} total task{tasks.length !== 1 ? "s" : ""} captured
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* view toggle */}
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setView("calendar")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  view === "calendar"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>📅</span> Calendar
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  view === "list"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>📋</span> List
              </button>
            </div>

            {/* new task button */}
            <button
              onClick={() => navigate(ROUTES.CAPTURE)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
            >
              <span>🎙️</span>
              New task
            </button>
          </div>
        </div>

        {/* ── loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* calendar view — full width with side panel */}
            {view === "calendar" && (
              <CalendarView
                tasks={tasks}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            )}

            {/* list view — narrower centered layout */}
            {view === "list" && (
              <div className="flex flex-col gap-4 w-full">
                <TaskFilters
                  active={activeFilter}
                  onChange={setActiveFilter}
                  counts={counts}
                />
                <TaskList
                  tasks={tasks}
                  filter={activeFilter}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}