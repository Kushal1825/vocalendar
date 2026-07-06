// ─────────────────────────────────────────
// LandingPage
// Public marketing page shown to signed out users
// Assembles all landing components in order
// Redirects signed in users to capture page
// ─────────────────────────────────────────

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";

// layout
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

// landing sections
import Hero from "../components/landing/Hero.jsx";
import Features from "../components/landing/Features.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import TrustBar from "../components/landing/TrustBar.jsx";

// constants
import { ROUTES } from "../constants/routes.js";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // ── redirect signed in users to app ──
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate(ROUTES.CAPTURE);
    }
  }, [isLoaded, isSignedIn]);

  // ── show nothing while Clerk loads ──
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── top navigation ── */}
      <Navbar />

      {/* ── main content ── */}
      <main className="flex-1">
        {/* hero — headline + CTA + visual */}
        <Hero />

        {/* features — 4 feature cards */}
        <Features />

        {/* how it works — 4 step process */}
        <HowItWorks />

        {/* trust bar — privacy + security badges */}
        <TrustBar />
      </main>

      {/* ── footer ── */}
      <Footer />
    </div>
  );
}