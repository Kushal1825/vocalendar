// ─────────────────────────────────────────
// Date formatting utilities
// Used by TaskCard and ConfirmationCard
// to display dates in human-readable format
// ─────────────────────────────────────────

// "2026-07-01" → "Wednesday, July 1"
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

// "2026-07-01T15:00:00" → "July 1, 2026"
export const formatShortDate = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// check if a date is in the past
export const isPastDate = (dateTimeStr) => {
  if (!dateTimeStr) return false;
  return new Date(dateTimeStr) < new Date();
};