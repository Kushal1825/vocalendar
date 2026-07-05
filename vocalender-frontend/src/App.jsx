import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/clerk-react";
import { useRecorder } from "./hooks/useRecorder";
import { useNotification } from "./hooks/useNotification";
import ConfirmationCard from "./components/ConfirmationCard";
import axios from "axios";

export default function App() {
  const { getToken } = useAuth();
  const { recording, audioBlob, start, stop } = useRecorder();
  const { requestPermission, scheduleNotification } = useNotification();
  const [transcript, setTranscript] = useState("");
  const [extracted, setExtracted] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const [calendarConnected, setCalendarConnected] = useState(false);

useEffect(() => {
  checkCalendarStatus();
}, []);

const checkCalendarStatus = async () => {
  try {
    const res = await authGet("http://localhost:8000/auth/status");
    setCalendarConnected(res.data.authenticated);
  } catch (err) {
    setCalendarConnected(false);
  }
};

const connectCalendar = async () => {
  try {
    const res = await authGet("http://localhost:8000/auth/google");
    window.location.href = res.data.auth_url;
  } catch (err) {
    setError("Failed to connect Google Calendar.");
  }
};

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (audioBlob) sendAudio(audioBlob);
  }, [audioBlob]);

  // authenticated axios helpers
  const authPost = async (url, data, config = {}) => {
    const token = await getToken();
    return axios.post(url, data, {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    });
  };

  const authGet = async (url) => {
    const token = await getToken();
    return axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const sendAudio = async (blob) => {
    if (!blob) return;
    setError("");
    setStatus("transcribing");

    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    try {
      const res = await authPost(
        "http://localhost:8000/transcribe",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setTranscript(res.data.transcript);
      await extractTask(res.data.transcript);
    } catch (err) {
      console.error(err);
      setError("Transcription failed. Please try again.");
      setStatus("idle");
    }
  };

  const extractTask = async (text) => {
    setStatus("extracting");
    try {
      const res = await authPost("http://localhost:8000/extract", {
        transcript: text
      });
      setExtracted(res.data);
      setStatus("confirming");
    } catch (err) {
      console.error(err);
      setError("Extraction failed. Please try again.");
      setStatus("idle");
    }
  };

  const handleConfirm = async (confirmedData) => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const startDateTime = `${confirmedData.date}T${confirmedData.time}:00`;
      const [hours, minutes] = confirmedData.time.split(":").map(Number);
      const endHour = String(hours + 1).padStart(2, "0");
      const endDateTime = `${confirmedData.date}T${endHour}:${String(minutes).padStart(2, "0")}:00`;

      await authPost("http://localhost:8000/calendar/create", {
        task: confirmedData.task,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        priority: confirmedData.priority,
        timezone: userTimezone
      });

      scheduleNotification(confirmedData.task, startDateTime);
      setStatus("success");

      setTimeout(() => {
        setStatus("idle");
        setExtracted(null);
        setTranscript("");
      }, 3000);

    } catch (err) {
      console.error(err);
      setError("Failed to save to calendar. Please try again.");
    }
  };

  const handleCancel = () => {
    setStatus("idle");
    setExtracted(null);
    setTranscript("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6">
       <div className="absolute top-4 right-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
      <h1 className="text-3xl font-bold">Vocalendar</h1>

      {/* not signed in */}
      <SignedOut>
        <p className="text-gray-400">Sign in to get started</p>
        <SignInButton mode="modal">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold transition-all">
            Sign in with Google
          </button>
        </SignInButton>
      </SignedOut>

      {/* signed in */}
      <SignedIn>
  {!calendarConnected ? (
    <div className="flex flex-col items-center gap-4">
      <p className="text-gray-400">Connect your Google Calendar to continue</p>
      <button
        onClick={connectCalendar}
        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
      >
        Connect Google Calendar
      </button>
    </div>
  ) : (
    // your existing mic button + confirmation card UI
    <>
      {error && (
        <div className="bg-red-900 rounded-xl p-4 max-w-md w-full text-center">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {status === "confirming" && extracted ? (
        <ConfirmationCard
          data={extracted}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <button
            onClick={recording ? stop : start}
            disabled={status === "transcribing" || status === "extracting"}
            className={`w-24 h-24 rounded-full text-white font-bold text-sm transition-all ${
              recording
                ? "bg-red-500 animate-pulse"
                : "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
            }`}
          >
            {recording ? "Stop" : "Record"}
          </button>

          {status === "transcribing" && <p className="text-gray-400">Transcribing...</p>}
          {status === "extracting" && <p className="text-gray-400">Extracting task...</p>}

          {status === "success" && (
            <div className="bg-green-800 rounded-xl p-4 max-w-md w-full text-center">
              <p className="text-green-300 font-bold text-lg">✓ Added to Google Calendar</p>
              <p className="text-gray-400 text-sm mt-1">Resetting in 3 seconds...</p>
            </div>
          )}
        </>
      )}
    </>
  )}
</SignedIn>
    </div>
  );
}