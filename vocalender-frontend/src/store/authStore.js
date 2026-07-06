// ─────────────────────────────────────────
// Auth store
// Simple module-level store for auth state
// shared across components that need it
// ─────────────────────────────────────────

// module-level variable — survives re-renders
let _calendarConnected = false;

export const getCalendarConnected = () => _calendarConnected;

export const setCalendarConnected = (value) => {
  _calendarConnected = value;
};