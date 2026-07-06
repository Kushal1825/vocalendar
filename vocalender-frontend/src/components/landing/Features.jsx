// ─────────────────────────────────────────
// Features
// Three feature cards explaining the product
// Shown below hero on landing page
// ─────────────────────────────────────────

const FEATURES = [
  {
    icon: "🎙️",
    title: "Voice-first experience",
    description:
      "Capture tasks naturally, anytime, anywhere. No typing required — just speak and we handle the rest.",
  },
  {
    icon: "✨",
    title: "AI understands you",
    description:
      "Advanced AI extracts the right details every time — task name, date, time, and priority automatically.",
  },
  {
    icon: "📅",
    title: "Saves to Google Calendar",
    description:
      "Your tasks are saved with reminders automatically. Never miss a deadline or appointment again.",
  },
  {
    icon: "🔔",
    title: "Stay on top of everything",
    description:
      "Get browser notifications 30 minutes before every task. View and manage all your tasks in one place.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── section header ── */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Built for people who think faster than they type.
          </p>
        </div>

        {/* ── feature grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}