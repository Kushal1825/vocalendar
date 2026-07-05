from pydantic import BaseModel, validator
from typing import Optional

class ExtractRequest(BaseModel):
    transcript: str

    @validator("transcript")
    def transcript_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Transcript cannot be empty")
        if len(v) > 5000:
            raise ValueError("Transcript too long")
        return v


class CreateEventRequest(BaseModel):
    task: str
    start_datetime: str
    end_datetime: str
    priority: str = "medium"
    timezone: str = "UTC"

    @validator("priority")
    def valid_priority(cls, v):
        if v not in ["low", "medium", "high"]:
            raise ValueError("Priority must be low, medium, or high")
        return v


class UpdateTaskRequest(BaseModel):
    task_name: Optional[str]
    scheduled_at: Optional[str]
    priority: Optional[str]