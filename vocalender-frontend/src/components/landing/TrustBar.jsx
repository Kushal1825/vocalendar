// ─────────────────────────────────────────
// TrustBar
// Bottom section of landing page
// Shows privacy and security assurances
// ─────────────────────────────────────────

const TRUST_ITEMS = [
  {
    icon: "🔒",
    title: "Your data is private",
    description: "We never store your calendar access without permission.",
  },
  {
    icon: "🛡️",
    title: "Secure by design",
    description: "Powered by Clerk for authentication and user management.",
  },
  {
    icon: "⚡",
    title: "Fast & reliable",
    description: "Built for speed so you can capture tasks without friction.",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-gray-50 border-t border-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}