// ─────────────────────────────────────────
// HowItWorks
// Step by step explanation of the product
// Shows what happens behind the scenes
// ─────────────────────────────────────────

const STEPS = [
  {
    step: "01",
    title: "Speak your task",
    description:
      "Click the mic button and speak naturally. Say something like 'Remind me to call the doctor tomorrow at 3pm'.",
    icon: "🎙️",
  },
  {
    step: "02",
    title: "AI extracts the details",
    description:
      "Our AI transcribes your voice and extracts the task name, date, time, and priority automatically.",
    icon: "✨",
  },
  {
    step: "03",
    title: "Review and confirm",
    description:
      "Check the extracted details and edit anything if needed. You're always in control before anything is saved.",
    icon: "✅",
  },
  {
    step: "04",
    title: "Saved to your calendar",
    description:
      "The event is created in your Google Calendar with a reminder. You'll get a notification 30 minutes before.",
    icon: "📅",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── section header ── */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From voice to calendar in under 10 seconds.
          </p>
        </div>

        {/* ── steps ── */}
        <div className="grid md:grid-cols-4 gap-8">
          {STEPS.map((item, index) => (
            <div key={item.step} className="flex flex-col gap-4 relative">

              {/* connector line between steps */}
              {index < STEPS.length - 0 && (
                <div className="hidden md:block absolute  top-6  w-full h-px bg-indigo-100 z-0" />
              )}

              {/* step number + icon */}
              <div className="relative z-10 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                {item.step}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}