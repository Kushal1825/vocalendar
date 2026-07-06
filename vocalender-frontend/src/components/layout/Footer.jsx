import { Link } from "react-router-dom";
import { CONFIG } from "../../constants/config.js";
import { ROUTES } from "../../constants/routes.js";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">
          © 2026 {CONFIG.APP_NAME}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link to={ROUTES.PRIVACY} className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            Privacy
          </Link>
          <Link to={ROUTES.TERMS} className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            Terms
          </Link>
          <a
            href="https://github.com/Kushal1825/vocalendar"
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