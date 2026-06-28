from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
import os
import secrets
import hashlib
import base64
import json

router = APIRouter()

SCOPES = ["https://www.googleapis.com/auth/calendar"]
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/callback")
CREDENTIALS_FILE = os.getenv("GOOGLE_CLIENT_SECRETS_FILE", "credentials/google_credentials.json")
TOKEN_FILE = "credentials/tokens.json"

def save_tokens(data: dict):
    with open(TOKEN_FILE, "w") as f:
        json.dump(data, f)

def load_tokens() -> dict:
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE) as f:
            return json.load(f)
    return {}

token_store = load_tokens()



def generate_code_verifier():
    return secrets.token_urlsafe(64)

def generate_code_challenge(verifier: str):
    digest = hashlib.sha256(verifier.encode()).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode()

@router.get("/auth/google")
async def auth_google():
    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )

    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)

    # store verifier to use in callback
    token_store["code_verifier"] = code_verifier

    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        code_challenge=code_challenge,
        code_challenge_method="S256"
    )
    token_store["state"] = state
    return RedirectResponse(auth_url)


@router.get("/auth/callback")
async def auth_callback(code: str, state: str):
    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
        state=state
    )

    # retrieve the verifier stored during /auth/google
    code_verifier = token_store.get("code_verifier")

    flow.fetch_token(
        code=code,
        code_verifier=code_verifier
    )

    credentials = flow.credentials
    token_store["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes
    }
    save_tokens(token_store)

    return {"message": "Google Calendar connected successfully"}


@router.get("/auth/status")
async def auth_status():
    if "credentials" in token_store:
        return {"authenticated": True}
    return {"authenticated": False}