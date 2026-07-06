// ─────────────────────────────────────────
// App-wide configuration
// Never hardcode these values in components
// ─────────────────────────────────────────

export const CONFIG = {
  // App identity
  APP_NAME: "Vocalendar",
  APP_TAGLINE: "Voice it. Done.",

  // API connection
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",

  // Recording limits
  MAX_RECORDING_SECONDS: 60,

  // Notification timing
  NOTIFICATION_MINUTES_BEFORE: 30,

  // Task defaults
  DEFAULT_PRIORITY: "medium",
  DEFAULT_TASK_DURATION_MINUTES: 60,

  // Supported audio types (must match backend validation)
  SUPPORTED_AUDIO_TYPES: ["audio/webm", "audio/wav", "audio/mp3"],
};