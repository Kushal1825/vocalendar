// ─────────────────────────────────────────
// All application routes defined in one place
// Import ROUTES instead of hardcoding strings
// ─────────────────────────────────────────

export const ROUTES = {
  // Public routes — accessible without login
  LANDING: "/",

  // Protected routes — require Clerk login
  ONBOARDING: "/onboarding",   // connect Google Calendar (first time only)
  CAPTURE: "/capture",          // main mic recording screen
  CONFIRM: "/confirm",          // review extracted task before saving
  SUCCESS: "/success",          // event added confirmation
  TASKS: "/tasks",              // task history dashboard

  // Fallback
  NOT_FOUND: "*",
};