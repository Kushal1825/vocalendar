// ─────────────────────────────────────────
// ProtectedRoute
// Wraps pages that require login
// Redirects to landing if not signed in
// Shows loading state while Clerk loads
// ─────────────────────────────────────────

import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  // ── wait for Clerk to initialize ──
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── redirect to landing if not signed in ──
  if (!isSignedIn) {
    return <Navigate to={ROUTES.LANDING} replace />;
  }

  return children;
}