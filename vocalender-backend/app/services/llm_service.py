from groq import Groq
from app.config import settings
from datetime import datetime, timedelta
import re
import json

client = Groq(api_key=settings.GROQ_API_KEY)


def parse_llm_json(raw: str) -> dict:
    cleaned = re.sub(r"```(?:json)?", "", raw).strip()
    return json.loads(cleaned)


def llm_extract(transcript: str) -> str:
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
- If no date mentioned, use tomorrow
- Time must be in 24hr HH:MM format. "8 o clock night" = 20:00, "3pm" = 15:00

Transcript: {transcript}
"""

    res = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a date and task extraction assistant. Return only valid JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        timeout=30 # 30 second timeout
    )
    return res.choices[0].message.content


def resolve_datetime(date_str, time_str):
    today = datetime.now()

    if not time_str:
        time_str = "09:00"

    if not date_str:
        date_str = (today + timedelta(days=1)).strftime("%Y-%m-%d")

    start = datetime.fromisoformat(f"{date_str}T{time_str}:00")

    if start < today:
        tomorrow = today + timedelta(days=1)
        date_str = tomorrow.strftime("%Y-%m-%d")
        start = datetime.fromisoformat(f"{date_str}T{time_str}:00")

    end = start + timedelta(hours=1)
    return start.isoformat(), end.isoformat()