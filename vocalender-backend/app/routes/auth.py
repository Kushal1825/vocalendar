from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from app.middleware.clerk_auth import get_current_user
from app.services.supabase_service import save_google_tokens, get_google_tokens, get_or_create_user
import os
import secrets
import hashlib
import base64

router = APIRouter()

SCOPES = ["https://www.googleapis.com/auth/calendar"]
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/callback")
CREDENTIALS_FILE = os.getenv("GOOGLE_CLIENT_SECRETS_FILE", "credentials/google_credentials.json")

# temporary state store — still needed for OAuth flow
state_store = {}

def generate_code_verifier():
    return secrets.token_urlsafe(64)

def generate_code_challenge(verifier: str):
    digest = hashlib.sha256(verifier.encode()).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode()


@router.get("/auth/google")
async def auth_google(current_user: dict = Depends(get_current_user)):
    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )

    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)

    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        code_challenge=code_challenge,
        code_challenge_method="S256",
        prompt="consent"
    )

    # store verifier and user_id together
    state_store[state] = {
        "code_verifier": code_verifier,
        "user_id": current_user["user_id"],
        "email": current_user["email"]
    }

    return {"auth_url": auth_url}


@router.get("/auth/callback")
async def auth_callback(code: str, state: str):
    state_data = state_store.get(state)
    if not state_data:
        raise HTTPException(status_code=400, detail="Invalid state")

    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
        state=state
    )

    flow.fetch_token(
        code=code,
        code_verifier=state_data["code_verifier"]
    )

    credentials = flow.credentials

    # save user to supabase
    get_or_create_user(state_data["user_id"], state_data["email"])

    # save tokens to supabase
    save_google_tokens(state_data["user_id"], {
        "access_token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": list(credentials.scopes)
    })

    # clean up state
    del state_store[state]

    return RedirectResponse("http://localhost:5173?connected=true")


@router.get("/auth/status")
async def auth_status(current_user: dict = Depends(get_current_user)):
    tokens = get_google_tokens(current_user["user_id"])
    return {"authenticated": tokens is not None}



@router.get("/auth/disconnect")
async def disconnect_calendar(current_user: dict = Depends(get_current_user)):
    try:
        from app.services.supabase_service import delete_google_tokens
        delete_google_tokens(current_user["user_id"])
        return {"message": "Google Calendar disconnected"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))