import { useState, useEffect } from "react";
import { useRecorder } from "./hooks/useRecorder";
import ConfirmationCard from "./components/ConfirmationCard";
import axios from "axios";

import { useNotification } from "./hooks/useNotification";


export default function App() {
  const { recording, audioBlob, start, stop } = useRecorder();
  const [transcript, setTranscript] = useState("");
  const [extracted, setExtracted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | transcribing | extracting | confirming

  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

useEffect(() => {
  axios.get("http://localhost:8000/auth/status")
    .then(res => setAuthenticated(res.data.authenticated))
    .catch(() => setAuthenticated(false));
}, []);


// inside App()
const { requestPermission, scheduleNotification } = useNotification();

useEffect(() => {
  requestPermission();
}, []);

  const sendAudio = async (blob) => {
    if (!blob) return;
    setStatus("transcribing");

    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    try {
      const res = await axios.post(
        "http://localhost:8000/transcribe",
        formData,
      );
      setTranscript(res.data.transcript);
      await extractTask(res.data.transcript);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setError("Transcription failed. Please try again.");
      setStatus("idle");
    }
  };

  const handleConfirm = async (confirmedData) => {
  try {
    const startDateTime = `${confirmedData.date}T${confirmedData.time}:00`;
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // calculate end time without UTC conversion
    const [hours, minutes] = confirmedData.time.split(":").map(Number);
    const endHour = String(hours + 1).padStart(2, "0");
    const endDateTime = `${confirmedData.date}T${endHour}:${String(minutes).padStart(2, "0")}:00`;

    await axios.post("http://localhost:8000/calendar/create", {
      task: confirmedData.task,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      priority: confirmedData.priority,
      timezone: userTimezone
    });

    scheduleNotification(confirmedData.task, `${confirmedData.date}T${confirmedData.time}:00`);

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

  const extractTask = async (text) => {
    setStatus("extracting");
    try {
      const res = await axios.post("http://localhost:8000/extract", {
        transcript: text,
      });
      setExtracted(res.data);
      setStatus("confirming");
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  useEffect(() => {
    if (audioBlob) sendAudio(audioBlob);
  }, [audioBlob]);

  

  const handleCancel = () => {
    setStatus("idle");
    setExtracted(null);
    setTranscript("");
  };


// in sendAudio catch block:
// in handleConfirm catch block:

// in JSX — show error message:
{error && (
  <div className="bg-red-900 rounded-xl p-4 max-w-md w-full text-center">
    <p className="text-red-300 text-sm">{error}</p>
  </div>
)}

  if (!authenticated) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Vocalendar</h1>
      <p className="text-gray-400">Connect your Google Calendar to get started</p>
      
      <a
        href="http://localhost:8000/auth/google"
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
      >
        Connect Google Calendar
      </a>
    </div>
  );
}else{
return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6">
      
      <h1 className="text-3xl font-bold">Vocalendar</h1>

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

          {status === "transcribing" && (
            <p className="text-gray-400">Transcribing...</p>
          )}
          {status === "extracting" && (
            <p className="text-gray-400">Extracting task...</p>
          )}

          {transcript && status === "idle" && (
            <div className="bg-gray-800 rounded-xl p-4 max-w-md w-full">
              <p className="text-sm text-gray-400 mb-1">Transcript</p>
              <p className="text-white">{transcript}</p>
            </div>
          )}
          {status === "success" && (
            <div className="bg-green-800 rounded-xl p-4 max-w-md w-full text-center">
              <p className="text-green-300 font-bold text-lg">
                ✓ Added to Google Calendar
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Resetting in 3 seconds...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

  
}
