from fastapi import APIRouter, HTTPException
from app.services.calendar_service import create_event, check_availability

router = APIRouter()

@router.post("/calendar/create")
async def create_calendar_event(payload: dict):
    try:
        result = create_event(
            task=payload["task"],
            start_datetime=payload["start_datetime"],
            end_datetime=payload["end_datetime"],
            priority=payload.get("priority", "medium"),
            timezone=payload.get("timezone", "UTC")
        )
        return result
    except Exception as e:
        print("CALENDAR ERROR:", str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/calendar/availability")
async def get_availability(date: str, time: str, duration: int = 60):
    try:
        return check_availability(date, time, duration)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))