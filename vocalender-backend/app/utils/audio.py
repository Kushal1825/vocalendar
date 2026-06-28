import subprocess
import os

def convert_to_wav(input_path: str) -> str:
    output_path = input_path.rsplit(".", 1)[0] + ".wav"

    subprocess.run([
        "ffmpeg", "-y",
        "-i", input_path,
        "-ar", "16000",
        "-ac", "1",
        output_path
    ], check=True, capture_output=True)

    return output_path