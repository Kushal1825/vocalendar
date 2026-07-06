// ─────────────────────────────────────────
// Capture store
// Holds state shared between CapturePage,
// ConfirmPage, and SuccessPage
// Simple module-level store — no Redux needed
// ─────────────────────────────────────────

import { useState } from "react";

// shared state — persists between page navigations
let _transcript = "";
let _extractedTask = null;

export const useCaptureStore = () => {
  const [transcript, setTranscriptState] = useState(_transcript);
  const [extractedTask, setExtractedTaskState] = useState(_extractedTask);

  const setTranscript = (text) => {
    _transcript = text;
    setTranscriptState(text);
  };

  const setExtractedTask = (task) => {
    _extractedTask = task;
    setExtractedTaskState(task);
  };

  const clearCapture = () => {
    _transcript = "";
    _extractedTask = null;
    setTranscriptState("");
    setExtractedTaskState(null);
  };

  return {
    transcript,
    extractedTask,
    setTranscript,
    setExtractedTask,
    clearCapture,
  };
};