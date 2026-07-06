// ─────────────────────────────────────────
// OnboardingPage
// Shown to first-time users after sign in
// Guides them to connect Google Calendar
// before they can use the app
// ─────────────────────────────────────────

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import Navbar from "../components/layout/Navbar";

export default function OnboardingPage() {
  const { calendarConnected, calendarLoading, connectCalendar } = useAuth();
  const navigate = useNavigate();

  // ── if already connected, skip to capture ──
  useEffect(() => {
    if (!calendarLoading && calendarConnected) {
      navigate(ROUTES.CAPTURE);
    }
  }, [calendarConnected, calendarLoading]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-8">

          {/* ── progress indicator ── */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
              ✓
            </div>
            <div className="w-16 h-px bg-indigo-200" />
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
              2
            </div>
            <div className="w-16 h-px bg-gray-200" />
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 text-sm font-bold flex items-center justify-center">
              3
            </div>
          </div>

          {/* ── calendar icon ── */}
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl">
            📅
          </div>

          {/* ── content ── */}
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Connect your Google Calendar
            </h1>
            <p className="text-gray-500 text-lg">
              Allow Vocalendar to create events and manage your tasks.
            </p>
          </div>

          {/* ── permissions list ── */}
          <div className="w-full bg-gray-50 rounded-2xl p-6 flex flex-col gap-3 text-left">
            {[
              { icon: "📅", text: "Create and manage events" },
              { icon: "👁️", text: "View your calendar" },
              { icon: "🔔", text: "Get reminders on your behalf" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-700 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          {/* ── connect button ── */}
          <button
            onClick={connectCalendar}
            disabled={calendarLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-200"
          >
            {calendarLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking...
              </span>
            ) : (
              "Connect Google Calendar"
            )}
          </button>

          {/* ── privacy note ── */}
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <span>🔒</span>
            Your data is private and never shared
          </p>
        </div>
      </main>
    </div>
  );
}