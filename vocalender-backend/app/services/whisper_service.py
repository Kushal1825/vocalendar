from faster_whisper import WhisperModel

_model = None


def get_model():
    global _model
    if _model is None:
        _model = WhisperModel(
            "base",  # upgrade later to small/medium
            device="cpu",  # change to "cuda" if GPU
            compute_type="int8"
        )
    return _model


def transcribe_audio(file_path: str):
    model = get_model()

    segments, info = model.transcribe(file_path)

    text = " ".join([segment.text for segment in segments])

    return {
        "transcript": text.strip(),
        "language": info.language
    }