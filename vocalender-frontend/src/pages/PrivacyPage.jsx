// ─────────────────────────────────────────
// PrivacyPage
// Required by Google OAuth for public apps
// Explains what data is collected and why
// ─────────────────────────────────────────

import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ROUTES } from "../constants/routes";

const Section = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    <div className="text-gray-600 leading-relaxed flex flex-col gap-2">
      {children}
    </div>
  </div>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-10">

          {/* ── header ── */}
          <div className="flex flex-col gap-3">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
              Legal
            </p>
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: July 6, 2026</p>
            <p className="text-gray-600 leading-relaxed">
              Vocalendar is built by Kushal as a personal productivity tool.
              This policy explains what data we collect, why we collect it,
              and how we protect it.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* ── sections ── */}
          <Section title="What data we collect">
            <p>When you use Vocalendar, we collect the following:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
              <li>Your Google account email address (via Clerk authentication)</li>
              <li>Google Calendar OAuth tokens to create and manage events on your behalf</li>
              <li>Voice recordings you submit — processed locally via Whisper and immediately deleted after transcription</li>
              <li>Task details you confirm — task name, date, time, and priority</li>
            </ul>
          </Section>

          <Section title="What we do NOT collect">
            <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
              <li>We do not store your voice recordings after transcription</li>
              <li>We do not read your existing Google Calendar events beyond availability checks</li>
              <li>We do not sell your data to any third party</li>
              <li>We do not use your data for advertising</li>
            </ul>
          </Section>

          <Section title="How we store your data">
            <p>
              Your account information and task data are stored in Supabase,
              a secure PostgreSQL database with row-level security enabled.
              Each user can only access their own data.
            </p>
            <p>
              Your Google Calendar OAuth tokens are encrypted using AES-256
              (Fernet symmetric encryption) before being stored. They are
              never stored in plain text.
            </p>
          </Section>

          <Section title="Google Calendar access">
            <p>
              Vocalendar requests access to your Google Calendar to create
              events and check availability. We request the minimum scope
              required: <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">https://www.googleapis.com/auth/calendar</code>.
            </p>
            <p>
              We only create events you explicitly confirm. We never modify
              or delete your existing calendar events without your action.
            </p>
            <p>
              You can revoke Vocalendar's access to your Google Calendar at
              any time by visiting{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Account Permissions
              </a>
              {" "}or by clicking Disconnect in the app settings.
            </p>
          </Section>

          <Section title="Third-party services">
            <p>Vocalendar uses the following third-party services:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
              <li>
                <strong>Clerk</strong> — authentication and user management.{" "}
                <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Clerk Privacy Policy
                </a>
              </li>
              <li>
                <strong>Supabase</strong> — database storage.{" "}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Supabase Privacy Policy
                </a>
              </li>
              <li>
                <strong>Groq</strong> — AI task extraction (transcript text is sent to Groq API).{" "}
                <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Groq Privacy Policy
                </a>
              </li>
              <li>
                <strong>Google Calendar API</strong> — calendar event creation.{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Privacy Policy
                </a>
              </li>
            </ul>
          </Section>

          <Section title="Your rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
              <li>Delete your account and all associated data at any time</li>
              <li>Export your task data on request</li>
              <li>Revoke Google Calendar access at any time</li>
              <li>Request information about what data we hold about you</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at the email below.
            </p>
          </Section>

          <Section title="Data retention">
            <p>
              Your data is retained as long as your account is active.
              If you delete your account, all associated data including
              Google tokens and tasks are permanently deleted within 24 hours.
              Voice recordings are never retained — they are deleted immediately
              after transcription.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              If you have any questions about this privacy policy or your data,
              contact Kushal at{" "}
              <a
                href="mailto:kushalkalsariya1825@gmail.com"
                className="text-blue-600 hover:underline"
              >
                kushalkalsariya1825@gmail.com
              </a>
            </p>
          </Section>

          {/* ── back link ── */}
          <Link
            to={ROUTES.LANDING}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors w-fit"
          >
            ← Back to home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}