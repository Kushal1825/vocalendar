// ─────────────────────────────────────────
// Extract service
// Sends transcript to Groq LLM via backend
// Returns structured task: title, date, time, priority
// ─────────────────────────────────────────

import api from "./api";

export const extractTask = async (transcript) => {
  const res = await api.post("/extract", { transcript });
  return res.data; // { title, start_datetime, end_datetime, priority }
};