// ─────────────────────────────────────────
// NotFoundPage
// Shows when user hits an unknown route
// ─────────────────────────────────────────

import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="text-gray-500 text-lg">Page not found</p>
      <Link
        to={ROUTES.LANDING}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-all"
      >
        Go home
      </Link>
    </div>
  );
}