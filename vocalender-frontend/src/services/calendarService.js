// ─────────────────────────────────────────
// Calendar service
// Creates events and checks availability
// on user's Google Calendar via backend
// ─────────────────────────────────────────

import api from "./api";

// create a new calendar event
export const createCalendarEvent = async (taskData) => {
  const res = await api.post("/calendar/create", taskData);
  return res.data; // { event_id, event_link, summary, start }
};

// check if a time slot is free
export const checkAvailability = async (date, time, duration = 60) => {
  const res = await api.get("/calendar/availability", {
    params: { date, time, duration },
  });
  return res.data; // { available, busy_slots }
};