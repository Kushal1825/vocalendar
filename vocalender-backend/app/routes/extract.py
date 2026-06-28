from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import re
import os
from groq import Groq
import json
from app.config import settings

router = APIRouter()

client = Groq(api_key=settings.GROQ_API_KEY)


# -----------------------------
# 🧠 STEP 1: LLM (ONLY INTENT)
# -----------------------------


def parse_llm_json(raw: str) -> dict:
    # Strip markdown code fences if present
    cleaned = re.sub(r"```(?:json)?", "", raw).strip()
    return json.loads(cleaned)



def llm_extract(transcript: str):
    today = datetime.now().strftime("%Y-%m-%d")
    
    prompt = f"""
Today's date is {today}.

Extract structured intent from this transcript and return ONLY JSON with no extra text:

{{
  "task": "",
  "date": "YYYY-MM-DD",
  "time": "HH:MM or null",
  "priority": "low|medium|high"
}}

Rules:
- Resolve ALL date references to exact YYYY-MM-DD format
- "tomorrow" = next day from today
- "first july" or "july 1st" = 2026-07-01
- "next monday" = calculate from today
- If no date mentioned, use today: {today}
- Time must be in 24hr HH:MM format. "8 o clock night" = 20:00, "3pm" = 15:00

Transcript: {transcript}
"""

    res = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a date and task extraction assistant. Return only valid JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1
    )
    return res.choices[0].message.content


# -----------------------------
# 🧠 STEP 2: TIME RESOLUTION (TRUTH LAYER)
# -----------------------------

def resolve_datetime(date_str, time_str):
    today = datetime.now()
    
    # default time if missing
    if not time_str:
        time_str = "09:00"
    
    # default date if missing
    if not date_str:
        date_str = (today + timedelta(days=1)).strftime("%Y-%m-%d")
    
    start = datetime.fromisoformat(f"{date_str}T{time_str}:00")
    
    # if date is in the past, push to tomorrow
    if start < today:
        tomorrow = today + timedelta(days=1)
        date_str = tomorrow.strftime("%Y-%m-%d")
        start = datetime.fromisoformat(f"{date_str}T{time_str}:00")
    
    end = start + timedelta(hours=1)
    return start.isoformat(), end.isoformat()
# -----------------------------
# 🚀 ENDPOINT
# -----------------------------
@router.post("/extract")
async def extract(payload: dict):
    transcript = payload.get("transcript")
    if not transcript:
        raise HTTPException(status_code=400, detail="Missing transcript")

    try:
        raw = llm_extract(transcript)
        
        import re
        cleaned = re.sub(r"```(?:json)?", "", raw).strip()
        data = json.loads(cleaned)
        
        print("LLM extracted:", data)  # debug line

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