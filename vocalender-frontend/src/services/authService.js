// ─────────────────────────────────────────
// Auth service
// Handles Google Calendar OAuth connection
// ─────────────────────────────────────────

import api from "./api";

// get Google OAuth URL from backend
export const getGoogleAuthUrl = async () => {
  const res = await api.get("/auth/google");
  return res.data.auth_url;
};

// check if user has connected Google Calendar
export const getCalendarStatus = async () => {
  const res = await api.get("/auth/status");
  return res.data.authenticated;
};

// disconnect Google Calendar
export const disconnectCalendar = async () => {
  const res = await api.get("/auth/disconnect");
  return res.data;
};