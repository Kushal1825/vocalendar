from dotenv import load_dotenv
import os
from pathlib import Path

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    APP_NAME = "Vocalendar API"
    APP_VERSION = "2.0.0"

    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    TOKEN_ENCRYPTION_KEY: str = os.getenv("TOKEN_ENCRYPTION_KEY", "")
    CLERK_ISSUER: str = os.getenv("CLERK_ISSUER", "")

    def validate(self):
        missing = []
        required = [
            "GROQ_API_KEY",
            "CLERK_SECRET_KEY",
            "SUPABASE_URL",
            "SUPABASE_SERVICE_KEY",
            "TOKEN_ENCRYPTION_KEY",
            "CLERK_ISSUER"
        ]
        for key in required:
            if not getattr(self, key, None):
                missing.append(key)
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

settings = Settings()
settings.validate()