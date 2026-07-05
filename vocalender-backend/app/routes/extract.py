from fastapi import APIRouter, HTTPException
from app.services.llm_service import llm_extract, parse_llm_json, resolve_datetime

router = APIRouter()


@router.post("/extract")
async def extract(payload: dict):
    transcript = payload.get("transcript")
    if not transcript:
        raise HTTPException(status_code=400, detail="Missing transcript")

    try:
        raw = llm_extract(transcript)
        data = parse_llm_json(raw)

        start_dt, end_dt = resolve_datetime(
            data.get("date"),
            data.get("time")
        )

        return {
            "title": data.get("task"),
            "start_datetime": start_dt,
            "end_datetime": end_dt,
            "timezone": "Auto",
            "priority": data.get("priority", "medium")
        }

    except Exception as e:
        return {
            "error": "extraction_failed",
            "details": str(e)
        }