// ─────────────────────────────────────────
// Navbar
// Shown on all pages
// Shows logo + nav links when signed out
// Shows logo + user button when signed in
// ─────────────────────────────────────────

import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { CONFIG } from "../../constants/config";

export default function Navbar() {
  const location = useLocation();

  // ── hide nav links on app pages ──
  const isAppPage = [
    ROUTES.CAPTURE,
    ROUTES.CONFIRM,
    ROUTES.SUCCESS,
    ROUTES.TASKS,
    ROUTES.ONBOARDING,
  ].includes(location.pathname);

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ── logo ── */}
        <Link to={ROUTES.LANDING} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-lg">{CONFIG.APP_NAME}</span>
        </Link>

        {/* ── navigation ── */}
        <div className="flex items-center gap-6">

          {/* signed out — show app page links on landing only */}
          <SignedOut>
            {!isAppPage && (
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                  How it works
                </a>
              </div>
            )}
          </SignedOut>

          {/* signed in — show app navigation */}
          <SignedIn>
            {isAppPage && (
              <div className="flex items-center gap-4">
                <Link
                  to={ROUTES.CAPTURE}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === ROUTES.CAPTURE
                      ? "text-indigo-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Capture
                </Link>
                <Link
                  to={ROUTES.TASKS}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === ROUTES.TASKS
                      ? "text-indigo-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Tasks
                </Link>
              </div>
            )}

            {/* user profile button — handles sign out */}
            <UserButton afterSignOutUrl={ROUTES.LANDING} />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}