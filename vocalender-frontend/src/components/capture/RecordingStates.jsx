// ─────────────────────────────────────────
// RecordingStates
// Shows current status text below mic button
// Four states with icons and descriptions:
//   idle       — prompt to start
//   recording  — actively listening
//   transcribing — converting audio to text
//   extracting   — AI understanding the task
// ─────────────────────────────────────────

const STATES = {
  idle: {
    icon: "💬",
    title: "Tap to speak",
    subtitle: 'Try: "Remind me to call mom tomorrow at 5pm"',
  },
  recording: {
    icon: "🎙️",
    title: "Listening...",
    subtitle: "Speak now — tap again to stop",
  },
  transcribing: {
    icon: "📝",
    title: "Transcribing...",
    subtitle: "Converting your voice to text",
  },
  extracting: {
    icon: "✨",
    title: "Understanding...",
    subtitle: "AI is extracting your task details",
  },
};

export default function RecordingStates({ state }) {
  const current = STATES[state] || STATES.idle;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-3xl">{current.icon}</span>
      <p className="text-gray-900 font-semibold text-lg">{current.title}</p>
      <p className="text-gray-400 text-sm max-w-xs">{current.subtitle}</p>
    </div>
  );
}