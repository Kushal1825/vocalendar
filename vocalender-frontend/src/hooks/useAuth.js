import { useState, useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { setTokenProvider } from "../services/api";
import { getCalendarStatus, getGoogleAuthUrl } from "../services/authService";
import { ROUTES } from "../constants/routes";

export const useAuth = () => {
  const { getToken, isSignedIn, isLoaded } = useClerkAuth();
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(true);

  // ── set token provider immediately when signed in ──
  useEffect(() => {
    if (isLoaded && isSignedIn && getToken) {
      setTokenProvider(getToken);
      checkCalendarStatus();
    } else if (isLoaded && !isSignedIn) {
      setCalendarLoading(false);
    }
  }, [isLoaded, isSignedIn, getToken]);

  // ── handle redirect back from Google OAuth ──
  useEffect(() => {
    if (window.location.search.includes("connected=true")) {
      window.history.replaceState({}, "", ROUTES.CAPTURE);
      setCalendarConnected(true);
      setCalendarLoading(false);
    }
  }, []);

  const checkCalendarStatus = async () => {
    try {
      setCalendarLoading(true);
      const connected = await getCalendarStatus();
      setCalendarConnected(connected);
    } catch (err) {
      setCalendarConnected(false);
    } finally {
      setCalendarLoading(false);
    }
  };

  const connectCalendar = async () => {
    try {
      // ensure token provider is set before making API call
      setTokenProvider(getToken);
      const authUrl = await getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      console.error("Failed to get Google auth URL:", err);
    }
  };

  return {
    isSignedIn,
    isLoaded,
    calendarConnected,
    calendarLoading,
    connectCalendar,
    checkCalendarStatus,
  };
};