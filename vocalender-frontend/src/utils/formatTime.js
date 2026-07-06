// ─────────────────────────────────────────
// Time formatting utilities
// Converts 24hr backend format to
// human-readable 12hr display format
// ─────────────────────────────────────────

// "15:00" → "3:00 PM"
export const formatDisplayTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
};

// "2026-07-01T15:00:00" → "3:00 PM"
export const formatTimeFromDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const time = dateTimeStr.split("T")[1]?.slice(0, 5);
  return formatDisplayTime(time);
};