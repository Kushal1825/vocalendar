// ─────────────────────────────────────────
// ConfirmPage
// Shows extracted task for user review
// Handles calendar save on confirm
// Navigates to success or back to capture
// ─────────────────────────────────────────

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCaptureStore } from "../store/captureStore";
import { createCalendarEvent } from "../services/calendarService";
import { useNotification } from "../hooks/useNotification";
import { getErrorMessage } from "../utils/errorMessages";
import { ROUTES } from "../constants/routes";

// components
import Navbar from "../components/layout/Navbar";
import PageWrapper from "../components/layout/PageWrapper";
import ConfirmationCard from "../components/confirm/ConfirmationCard";

export default function ConfirmPage() {
  const { extractedTask, clearCapture } = useCaptureStore();
  const { scheduleNotification } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── redirect if no extracted task — user landed here directly ──
  useEffect(() => {
    if (!extractedTask) {
      navigate(ROUTES.CAPTURE);
    }
  }, [extractedTask]);

  const handleConfirm = async (confirmedData) => {
    try {
      setLoading(true);
      setError("");

      // ── build datetime strings ──
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const startDateTime = `${confirmedData.date}T${confirmedData.time}:00`;
      const [hours, minutes] = confirmedData.time.split(":").map(Number);
      const endHour = String(hours + 1).padStart(2, "0");
      const endDateTime = `${confirmedData.date}T${endHour}:${String(minutes).padStart(2, "0")}:00`;

      // ── save to Google Calendar ──
      await createCalendarEvent({
        task: confirmedData.task,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        priority: confirmedData.priority,
        timezone: userTimezone,
      });

      // ── schedule browser notification ──
      scheduleNotification(confirmedData.task, startDateTime);

      // ── navigate to success ──
      navigate(ROUTES.SUCCESS);

    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearCapture();
    navigate(ROUTES.CAPTURE);
  };

  if (!extractedTask) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <PageWrapper>
        <div className="py-8">

          {/* ── error message ── */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 mb-6 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* ── confirmation card ── */}
          <ConfirmationCard
            data={extractedTask}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </PageWrapper>
    </div>
  );
}