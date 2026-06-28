from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    APP_NAME = "Vocalendar API"
    APP_VERSION = "1.0.0"

    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    def validate(self):
        if not self.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is missing from .env file")

settings = Settings()
settings.validate()  # crashes immediately at startup if key is missing