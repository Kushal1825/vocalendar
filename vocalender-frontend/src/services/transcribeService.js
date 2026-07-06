// ─────────────────────────────────────────
// Transcribe service
// Sends audio blob to backend Whisper endpoint
// Returns transcript text
// ─────────────────────────────────────────

import api from "./api";

export const transcribeAudio = async (audioBlob) => {
  // wrap blob in FormData — required for file upload
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");

  const res = await api.post("/transcribe", formData, {
    headers: {
      // override default JSON content type for file upload
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // { transcript, language }
};