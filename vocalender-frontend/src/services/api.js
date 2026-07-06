// ─────────────────────────────────────────
// Axios instance — used by all service files
// Automatically attaches Clerk auth token
// to every request sent to the backend
// ─────────────────────────────────────────

import axios from "axios";
import { CONFIG } from "../constants/config";

// base axios instance with backend URL
const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────
// Token injector
// Call this once after Clerk loads to give
// api.js access to the getToken function
// ─────────────────────────────────────────

let _getToken = null;

export const setTokenProvider = (getToken) => {
  _getToken = getToken;
};

// ─────────────────────────────────────────
// Request interceptor
// Runs before every request — attaches
// the current Clerk JWT to Authorization header
// ─────────────────────────────────────────

api.interceptors.request.use(async (config) => {
  if (_getToken) {
    const token = await _getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─────────────────────────────────────────
// Response interceptor
// Runs after every response — handles
// common errors in one place
// ─────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.detail || "Something went wrong";

    // log for debugging — remove before production
    console.error(`API Error [${status}]:`, message);

    return Promise.reject(error);
  }
);

export default api;