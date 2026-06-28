from pydantic import BaseModel
from typing import Optional


class TaskExtractRequest(BaseModel):
    transcript: str


class TaskExtractResponse(BaseModel):
    task: str
    date: Optional[str] = None
    time: Optional[str] = None
    priority: Optional[str] = "medium"