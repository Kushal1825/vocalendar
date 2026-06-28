from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os

from app.services.whisper_service import transcribe_audio
from app.utils.audio import convert_to_wav

router = APIRouter()

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    suffix = os.path.splitext(file.filename)[-1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    wav_path = None

    try:
        wav_path = convert_to_wav(tmp_path)
        result = transcribe_audio(wav_path)
        return result

    except Exception as e:
        return {
            "error": "transcription_failed",
            "details": str(e)
        }

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)