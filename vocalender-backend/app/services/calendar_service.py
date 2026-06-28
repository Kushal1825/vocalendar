from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from app.routes.auth import token_store

def get_calendar_service():
    creds_data = token_store.get("credentials")
    if not creds_data:
        raise Exception("Not authenticated. Visit /auth/google first.")
    
    credentials = Credentials(
        token=creds_data["token"],
        refresh_token=creds_data["refresh_token"],
        token_uri=creds_data["token_uri"],
        client_id=creds_data["client_id"],
        client_secret=creds_data["client_secret"],
        scopes=creds_data["scopes"]
    )
    return build("calendar", "v3", credentials=credentials)


def create_event(task: str, start_datetime: str, end_datetime: str, priority: str, timezone: str = "UTC"):
    service = get_calendar_service()
    
    event = {
        "summary": task,
        "description": f"Priority: {priority} | Created by Vocalendar",
        "start": {
            "dateTime": start_datetime,
            "timeZone": timezone  # use dynamic timezone
        },
        "end": {
            "dateTime": end_datetime,
            "timeZone": timezone  # use dynamic timezone
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

def check_availability(date: str, time: str, duration_minutes: int = 60):
    service = get_calendar_service()
    
    from datetime import datetime, timedelta
    start = datetime.fromisoformat(f"{date}T{time}:00")
    end = start + timedelta(minutes=duration_minutes)
    
    body = {
        "timeMin": start.isoformat() + "+05:30",
        "timeMax": end.isoformat() + "+05:30",
        "items": [{"id": "primary"}]
    }
    
    result = service.freebusy().query(body=body).execute()
    busy = result["calendars"]["primary"]["busy"]
    return {"available": len(busy) == 0, "busy_slots": busy}