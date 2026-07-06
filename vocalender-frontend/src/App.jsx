// ─────────────────────────────────────────
// App.jsx — routing only
// No business logic here
// Each page handles its own state
// ─────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";

// pages
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import CapturePage from "./pages/CapturePage";
import ConfirmPage from "./pages/ConfirmPage";
import SuccessPage from "./pages/SuccessPage";
import TasksPage from "./pages/TasksPage";
import NotFoundPage from "./pages/NotFoundPage";

// layout
import ProtectedRoute from "./components/layout/ProtectedRoute";

// constants
import { ROUTES } from "./constants/routes";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── public route ── */}
        <Route path={ROUTES.LANDING} element={<LandingPage />} />

        {/* ── protected routes — require Clerk login ── */}
        <Route
          path={ROUTES.ONBOARDING}
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CAPTURE}
          element={
            <ProtectedRoute>
              <CapturePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CONFIRM}
          element={
            <ProtectedRoute>
              <ConfirmPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SUCCESS}
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TASKS}
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />
        {/* ── fallback ── */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
