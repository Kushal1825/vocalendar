// ─────────────────────────────────────────
// CapturePage
// Main app screen — voice recording
// Flow: idle → recording → transcribing
//       → extracting → navigate to confirm
// ─────────────────────────────────────────

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRecorder } from "../hooks/useRecorder";
import { useCaptureStore } from "../store/captureStore";
import { transcribeAudio } from "../services/transcribeService";
import { extractTask } from "../services/extractService";
import { getErrorMessage } from "../utils/errorMessages";
import { ROUTES } from "../constants/routes";

// components
import Navbar from "../components/layout/Navbar";
import PageWrapper from "../components/layout/PageWrapper";
import MicButton from "../components/capture/MicButton";
import WaveAnimation from "../components/capture/WaveAnimation";
import RecordingStates from "../components/capture/RecordingStates";

export default function CapturePage() {
  const { calendarConnected, calendarLoading } = useAuth();
  const { recording, audioBlob, start, stop } = useRecorder();
  const { setTranscript, setExtractedTask } = useCaptureStore();
  const navigate = useNavigate();

  // ── recording pipeline state ──
  const [appState, setAppState] = useState("idle");
  // idle | recording | transcribing | extracting
  const [error, setError] = useState("");

  // ── redirect to onboarding if calendar not connected ──
  useEffect(() => {
    if (!calendarLoading && !calendarConnected) {
      navigate(ROUTES.ONBOARDING);
    }
  }, [calendarConnected, calendarLoading]);

  // ── process audio when recording stops ──
  useEffect(() => {
    if (audioBlob) {
      processAudio(audioBlob);
    }
  }, [audioBlob]);

  // ── update state when recording starts/stops ──
  useEffect(() => {
    if (recording) {
      setAppState("recording");
      setError("");
    }
  }, [recording]);

  // ── handle mic button click ──
  const handleMicClick = () => {
    if (appState === "idle") {
      start();
    } else if (appState === "recording") {
      stop();
      setAppState("transcribing");
    }
  };

  // ── full pipeline: audio → transcript → extract → navigate ──
  const processAudio = async (blob) => {
    try {
      // step 1 — transcribe audio
      setAppState("transcribing");
      const transcribeResult = await transcribeAudio(blob);
      const transcript = transcribeResult.transcript;
      setTranscript(transcript);

      // step 2 — extract task details
      setAppState("extracting");
      const extracted = await extractTask(transcript);
      setExtractedTask(extracted);

      // step 3 — navigate to confirm
      navigate(ROUTES.CONFIRM);

    } catch (err) {
      setError(getErrorMessage(err));
      setAppState("idle");
    }
  };

  // ── show spinner while checking calendar status ──
  if (calendarLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── map app state to mic button state ──
  const micState =
    appState === "recording"
      ? "recording"
      : appState === "transcribing" || appState === "extracting"
      ? "processing"
      : "idle";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <PageWrapper>
        <div className="flex flex-col items-center gap-10 py-12">

          {/* ── page header ── */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              What's on your mind?
            </h1>
            <p className="text-gray-500">
              Tap the microphone and start speaking
            </p>
          </div>

          {/* ── mic button ── */}
          <div className="flex flex-col items-center gap-6">
            <MicButton state={micState} onClick={handleMicClick} />
            <WaveAnimation isRecording={appState === "recording"} />
          </div>

          {/* ── status text ── */}
          <RecordingStates state={appState} />

          {/* ── error message ── */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 max-w-sm w-full text-center">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => setError("")}
                className="text-red-400 text-xs mt-2 hover:text-red-600"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ── navigate to tasks ── */}
          <button
            onClick={() => navigate(ROUTES.TASKS)}
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            View my tasks →
          </button>
        </div>
      </PageWrapper>
    </div>
  );
}