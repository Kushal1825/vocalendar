// src/hooks/useRecorder.js

import { useState, useRef } from "react";

export function useRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return { recording, audioBlob, start, stop };
}