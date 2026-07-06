// ─────────────────────────────────────────
// MicButton
// The core interaction element of the app
// Three visual states:
//   idle     — ready to record (indigo)
//   recording — actively recording (red pulse)
//   processing — waiting for response (spinner)
// ─────────────────────────────────────────

export default function MicButton({ state, onClick }) {
  // state: "idle" | "recording" | "processing"

  const isIdle = state === "idle";
  const isRecording = state === "recording";
  const isProcessing = state === "processing";

  return (
    <button
      onClick={onClick}
      disabled={isProcessing}
      className={`
        relative w-32 h-32 rounded-full
        flex items-center justify-center
        transition-all duration-300
        shadow-2xl disabled:cursor-not-allowed
        ${isIdle ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-200 hover:scale-105" : ""}
        ${isRecording ? "bg-red-500 shadow-red-200 scale-110" : ""}
        ${isProcessing ? "bg-gray-300 shadow-gray-200" : ""}
      `}
    >
      {/* ── recording pulse ring ── */}
      {isRecording && (
        <span className="absolute inline-flex w-full h-full rounded-full bg-red-400 opacity-50 animate-ping" />
      )}

      {/* ── idle and recording — mic icon ── */}
      {!isProcessing && (
        <svg
          className={`w-14 h-14 ${isRecording ? "text-white" : "text-white"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      )}

      {/* ── processing — spinner ── */}
      {isProcessing && (
        <div className="w-10 h-10 border-4 border-gray-400 border-t-indigo-600 rounded-full animate-spin" />
      )}
    </button>
  );
}