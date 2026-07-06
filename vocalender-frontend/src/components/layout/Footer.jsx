// ─────────────────────────────────────────
// Footer
// Shown on landing page only
// Keep it minimal — links and copyright
// ─────────────────────────────────────────

import { CONFIG } from "../../constants/config";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* ── copyright ── */}
        <p className="text-gray-400 text-sm">
          © 2026 {CONFIG.APP_NAME}. All rights reserved.
        </p>

        {/* ── links ── */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            Privacy
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            Terms
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}