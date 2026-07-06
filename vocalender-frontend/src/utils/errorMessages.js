// ─────────────────────────────────────────
// User-friendly error messages
// Maps technical errors to readable text
// Never show raw API errors to users
// ─────────────────────────────────────────

export const ERROR_MESSAGES = {
  TRANSCRIPTION_FAILED: "Couldn't understand the audio. Please try again.",
  EXTRACTION_FAILED: "Couldn't extract task details. Please try again.",
  CALENDAR_SAVE_FAILED: "Couldn't save to Google Calendar. Please try again.",
  CALENDAR_NOT_CONNECTED: "Please connect your Google Calendar first.",
  NETWORK_ERROR: "Connection failed. Check your internet and try again.",
  MIC_PERMISSION_DENIED: "Microphone access denied. Please allow mic access in browser settings.",
  FILE_TOO_LARGE: "Audio file is too large. Please record a shorter message.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
};

// map API status codes to messages
export const getErrorMessage = (error) => {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;

  if (!navigator.onLine) return ERROR_MESSAGES.NETWORK_ERROR;
  if (status === 401) return ERROR_MESSAGES.CALENDAR_NOT_CONNECTED;
  if (status === 413) return ERROR_MESSAGES.FILE_TOO_LARGE;
  if (detail) return detail;
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};