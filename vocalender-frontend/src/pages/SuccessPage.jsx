// ─────────────────────────────────────────
// SuccessPage
// Shown after task is saved to calendar
// Celebrates the save with clear confirmation
// Options to capture another or view tasks
// Auto-redirects to capture after 5 seconds
// ─────────────────────────────────────────

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCaptureStore } from "../store/captureStore";
import { ROUTES } from "../constants/routes";
import Navbar from "../components/layout/Navbar";

export default function SuccessPage() {
  const { transcript, extractedTask, clearCapture } = useCaptureStore();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // ── auto redirect to capture after 5 seconds ──
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCaptureAnother();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCaptureAnother = () => {
    clearCapture();
    navigate(ROUTES.CAPTURE);
  };

  const handleViewTasks = () => {
    clearCapture();
    navigate(ROUTES.TASKS);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full flex flex-col items-center gap-8 text-center">

          {/* ── success animation ── */}
          <div className="relative">
            {/* outer ring */}
            <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">
              {/* inner circle */}
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ── success message ── */}
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Added to Google Calendar!
            </h1>
            <p className="text-gray-500">
              You'll get a reminder 30 minutes before.
            </p>
          </div>

          {/* ── task summary card ── */}
          {extractedTask && (
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3 text-left">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Saved task
              </p>
              <p className="text-gray-900 font-semibold text-lg">
                {extractedTask.title}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span>📅</span>
                  {new Date(extractedTask.start_datetime).toLocaleDateString(
                    "en-US",
                    { weekday: "long", month: "long", day: "numeric" }
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <span>🕐</span>
                  {new Date(extractedTask.start_datetime).toLocaleTimeString(
                    "en-US",
                    { hour: "numeric", minute: "2-digit" }
                  )}
                </span>
              </div>
            </div>
          )}

          {/* ── action buttons ── */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleCaptureAnother}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-semibold transition-all"
            >
              🎙️ Capture another task
            </button>

            <button
              onClick={handleViewTasks}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm transition-all"
            >
              View all my tasks
            </button>
          </div>

          {/* ── auto redirect countdown ── */}
          <p className="text-gray-400 text-sm">
            Returning to capture in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
}