from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from app.services.supabase_service import get_google_tokens, save_google_tokens
from datetime import datetime, timedelta

def get_calendar_service(user_id: str):
    creds_data = get_google_tokens(user_id)
    if not creds_data:
        raise Exception("Not authenticated. Connect Google Calendar first.")

    credentials = Credentials(
        token=creds_data["access_token"],
        refresh_token=creds_data["refresh_token"],
        token_uri=creds_data["token_uri"],
        client_id=creds_data["client_id"],
        client_secret=creds_data["client_secret"],
        scopes=creds_data["scopes"]
    )

    # add this guard here
    if not credentials.refresh_token:
        raise Exception("Missing refresh token. Please reconnect Google Calendar.")

    # refresh if expired
    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())

        save_google_tokens(user_id, {
            "access_token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": list(credentials.scopes)
        })

    return build("calendar", "v3", credentials=credentials)


def create_event(user_id: str, task: str, start_datetime: str, end_datetime: str, priority: str, timezone: str = "UTC"):
    service = get_calendar_service(user_id)

    event = {
        "summary": task,
        "description": f"Priority: {priority} | Created by Vocalendar",
        "start": {
            "dateTime": start_datetime,
            "timeZone": timezone
        },
        "end": {
            "dateTime": end_datetime,
            "timeZone": timezone
        },
        "reminders": {
            "useDefault": False,
            "overrides": [
                {"method": "popup", "minutes": 30},
                {"method": "email", "minutes": 60}
            ]
        }
    }

    result = service.events().insert(calendarId="primary", body=event).execute()
    return {
        "event_id": result["id"],
        "event_link": result.get("htmlLink"),
        "summary": result["summary"],
        "start": result["start"]["dateTime"]
    }


def check_availability(user_id: str, date: str, time: str, duration_minutes: int = 60):
    service = get_calendar_service(user_id)

    start = datetime.fromisoformat(f"{date}T{time}:00")
    end = start + timedelta(minutes=duration_minutes)

    body = {
        "timeMin": start.isoformat(),
        "timeMax": end.isoformat(),
        "items": [{"id": "primary"}],
        "timeZone": "UTC"
    }

    result = service.freebusy().query(body=body).execute()
    busy = result["calendars"]["primary"]["busy"]
    return {"available": len(busy) == 0, "busy_slots": busy}