// ─────────────────────────────────────────
// WaveAnimation
// Visual feedback while recording
// Animated bars that simulate audio waveform
// Only visible during recording state
// ─────────────────────────────────────────

export default function WaveAnimation({ isRecording }) {
  if (!isRecording) return null;

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="w-1.5 bg-indigo-400 rounded-full animate-pulse"
          style={{
            // stagger heights and animation delays for natural wave look
            height: `${Math.random() * 24 + 8}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.6 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}