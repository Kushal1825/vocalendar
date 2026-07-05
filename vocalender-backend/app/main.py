from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded


# router
from app.routes.health import router as health_router
from app.routes.transcribe import router as transcribe_router
from app.routes.extract import router as extract_router
from app.routes.calendar import router as calendar_router
from app.routes.auth import router as auth_router
import os

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

app = FastAPI(
    title="Vocalendar API",
    version="1.0.0",
    description="Voice-first task capture API"
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded,_rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(transcribe_router)
app.include_router(extract_router)
app.include_router(calendar_router)
app.include_router(auth_router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Vocalendar API"
    }