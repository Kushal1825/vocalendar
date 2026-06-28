# Vocalendar 🎙️📅

A voice-first task capture app that listens to what you say, extracts the task and time, and saves it directly to your Google Calendar — with browser notifications before the event.

**Speak → Confirm → Done. No typing required.**

---

## What It Does

- Record your voice or upload an audio file
- AI transcribes and extracts task, date, time, and priority
- Shows a confirmation card — edit anything before saving
- Creates a Google Calendar event at the correct time
- Sends a browser notification 30 minutes before the event

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | FastAPI (Python) |
| Transcription | faster-whisper (runs locally, free) |
| LLM Extraction | Groq API (free tier) |
| Calendar | Google Calendar API |
| Audio Conversion | ffmpeg |

---

## Prerequisites

Install these before starting:

- **Python 3.10+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **uv** (Python package manager) — [astral.sh/uv](https://astral.sh/uv)
- **ffmpeg** — [ffmpeg.org](https://ffmpeg.org) or via winget/brew
- **Groq API key** — [console.groq.com](https://console.groq.com) (free)
- **Google Cloud Project** with Calendar API enabled

---

## Folder Structure

```
vocalendar/
│
├── vocalendar-backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── health.py
│   │   │   ├── transcribe.py
│   │   │   ├── extract.py
│   │   │   ├── calendar.py
│   │   │   └── auth.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── whisper_service.py
│   │   │   ├── llm_service.py
│   │   │   └── calendar_service.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── task.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── audio.py
│   ├── credentials/              ← create this folder manually
│   │   └── google_credentials.json  ← download from Google Cloud Console
│   ├── .env                      ← create from .env.example
│   ├── .env.example
│   ├── .gitignore
│   └── requirements.txt
│
└── vocalendar-frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── MicButton.jsx
    │   │   └── ConfirmationCard.jsx
    │   ├── hooks/
    │   │   ├── useRecorder.js
    │   │   └── useNotification.js
    │   ├── services/
    │   │   └── api.js
    │   └── styles/
    │       └── index.css
    ├── .env
    └── package.json
```

---

## Setup Guide

### Step 1 — Install ffmpeg

**Windows:**
```powershell
winget install ffmpeg
```
Close and reopen your terminal after install. Verify:
```powershell
ffmpeg -version
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

---

### Step 2 — Get a Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Create an API key
4. Copy it — you'll need it in Step 5

---

### Step 3 — Set Up Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project — name it `vocalendar`
3. Go to **APIs & Services → Enable APIs**
4. Search for **Google Calendar API** and enable it
5. Go to **APIs & Services → Credentials**
6. Click **Create Credentials → OAuth Client ID**
7. If prompted, configure consent screen first:
   - User type: **External**
   - App name: `Vocalendar`
   - Add your Gmail as a test user under **Data Access → Test Users**
8. Application type: **Web application**
9. Authorized redirect URIs: `http://localhost:8000/auth/callback`
10. Click **Create**
11. Download the JSON file
12. Rename it to `google_credentials.json`
13. Place it in `vocalendar-backend/credentials/google_credentials.json`

---

### Step 4 — Backend Setup

```bash
cd vocalendar-backend
```

**Create virtual environment:**

Windows:
```powershell
uv venv
venv\Scripts\activate
```

Mac/Linux:
```bash
uv venv
source venv/bin/activate
```

**Install dependencies:**
```bash
uv pip install fastapi uvicorn httpx python-multipart faster-whisper python-dotenv pydantic groq google-auth google-auth-oauthlib google-api-python-client
```

---

### Step 5 — Configure Environment Variables

Create `.env` file inside `vocalendar-backend/`:

```env
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_CLIENT_SECRETS_FILE=credentials/google_credentials.json
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback
OAUTHLIB_INSECURE_TRANSPORT=1
OAUTHLIB_RELAX_TOKEN_SCOPE=1
```

Replace `your_groq_api_key_here` with the key from Step 2.

---

### Step 6 — Frontend Setup

```bash
cd vocalendar-frontend
npm install
```

Create `.env` file inside `vocalendar-frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

---

### Step 7 — Run the App

You need two terminals open simultaneously.

**Terminal 1 — Backend:**
```bash
cd vocalendar-backend
venv\Scripts\activate        # Windows
# or: source venv/bin/activate  # Mac/Linux
python -m uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`
Swagger API docs: `http://localhost:8000/docs`

**Terminal 2 — Frontend:**
```bash
cd vocalendar-frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### Step 8 — Connect Google Calendar

1. Open `http://localhost:5173` in your browser
2. Click **Connect Google Calendar**
3. Sign in with your Google account
4. Grant calendar access
5. You'll be redirected back — you're now connected

> You only need to do this once. Your credentials are saved locally in `credentials/tokens.json`.

---

### Step 9 — Allow Browser Notifications

When the app loads, your browser will ask for notification permission. Click **Allow** so reminders work.

If you accidentally clicked Block:
- Click the lock icon in your browser address bar
- Find Notifications → change to Allow
- Refresh the page

---

## Using the App

1. Click the **Record** button and speak your task
   - Example: *"Remind me to call the doctor tomorrow at 3pm"*
   - Example: *"Team meeting on July 5th at 10am, high priority"*
2. Click **Stop** when done
3. Wait for transcription and extraction (5-10 seconds)
4. Review the confirmation card — edit any field if needed
5. Click **Confirm** to save to Google Calendar
6. You'll receive a browser notification 30 minutes before the event

---

## Files You Must Create Manually

These files are not included in the repo for security reasons:

| File | How to get it |
|---|---|
| `vocalendar-backend/.env` | Copy from `.env.example` and fill in your keys |
| `vocalendar-backend/credentials/google_credentials.json` | Download from Google Cloud Console (Step 3) |
| `vocalendar-frontend/.env` | Create with `VITE_API_URL=http://localhost:8000` |

---

## Common Issues

**ffmpeg not found:**
Close your terminal completely and open a new one after installing ffmpeg. Windows doesn't update PATH in existing terminal sessions.

**Google OAuth 403 access_denied:**
You haven't added yourself as a test user. Go to Google Cloud Console → APIs & Services → OAuth Consent Screen → Test Users → Add your Gmail.

**Notification not showing:**
Check that your browser allows notifications for `localhost:5173`. Go to browser settings → Site permissions → Notifications.

**Transcription returns empty:**
Your audio file may be in an unsupported format. The app converts automatically via ffmpeg — make sure ffmpeg is installed and accessible.

**Calendar event saved at wrong time:**
The app auto-detects your timezone from the browser. If time is still wrong, check your system timezone settings.

**Token expired / not authenticated error:**
Visit `http://localhost:8000/auth/google` to re-authenticate. This only happens if you delete `credentials/tokens.json` or the token expires.

---

## .gitignore

Make sure your `.gitignore` includes:

```
credentials/
.env
__pycache__/
.venv
venv/
*.pyc
node_modules/
dist/
```

---

## License

MIT — free to use and modify.

---

Built with 🔥 by Kushal
