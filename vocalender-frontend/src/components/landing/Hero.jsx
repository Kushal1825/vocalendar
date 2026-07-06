// ─────────────────────────────────────────
// Hero
// First section users see on landing page
// Headline + subtext + sign in button
// Split layout — content left, visual right
// ─────────────────────────────────────────

import { SignInButton } from "@clerk/clerk-react";
import { CONFIG } from "../../constants/config";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

      {/* ── left — headline and CTA ── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Voice it.
            <br />
            <span className="text-indigo-600">Done.</span>
          </h1>
          <p className="text-xl text-gray-500 mt-2">
            Speak naturally. We'll handle the rest.
            <br />
            AI understands, your calendar remembers.
          </p>
        </div>

        {/* ── feature pills ── */}
        <div className="flex flex-col gap-3">
          {[
            { icon: "🎙️", label: "Voice-first", desc: "Capture tasks instantly" },
            { icon: "✨", label: "AI-powered", desc: "Smart understanding" },
            { icon: "📅", label: "Calendar-ready", desc: "Saved to Google Calendar" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">
                {item.icon}
              </div>
              <div>
                <span className="text-indigo-600 font-semibold text-sm">{item.label}</span>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA button ── */}
        <SignInButton mode="modal">
          <button className="w-fit bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300">
            Get Started Free
          </button>
        </SignInButton>

        <p className="text-gray-400 text-sm">No credit card required</p>
      </div>

      {/* ── right — visual demo cards ── */}
      <div className="relative hidden md:flex items-center justify-center">

        {/* background circle */}
        <div className="w-80 h-80 rounded-full bg-indigo-50 flex items-center justify-center">
          <div className="w-60 h-60 rounded-full bg-indigo-100 flex items-center justify-center">

            {/* mic button visual */}
            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-300">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* floating card — voice input */}
        <div className="absolute top-4 right-0 bg-white rounded-2xl shadow-lg p-4 max-w-48">
          <p className="text-gray-400 text-xs mb-1">Remind me to</p>
          <p className="text-gray-900 text-sm font-medium">call mom tomorrow at 5pm</p>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-1 h-3 bg-indigo-400 rounded-full" />
            <div className="w-1 h-5 bg-indigo-600 rounded-full" />
            <div className="w-1 h-2 bg-indigo-400 rounded-full" />
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            <div className="w-1 h-3 bg-indigo-400 rounded-full" />
          </div>
        </div>

        {/* floating card — success */}
        <div className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-gray-900 text-sm font-semibold">Added to</p>
            <p className="text-gray-500 text-xs">Google Calendar</p>
          </div>
        </div>
      </div>
    </section>
  );
}