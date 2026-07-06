// ─────────────────────────────────────────
// main.jsx — app entry point
// Wraps everything in ClerkProvider
// Sets token provider at root level so
// all API calls have auth from the start
// ─────────────────────────────────────────

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./styles/index.css";
import { setTokenProvider } from "./services/api";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key — check your .env file");
}

// ── inner wrapper to access useAuth hook ──
function AuthProvider({ children }) {
  const { getToken, isSignedIn } = useAuth();

  // set token provider as soon as user is signed in
  if (isSignedIn && getToken) {
    setTokenProvider(getToken);
  }

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  </StrictMode>
);