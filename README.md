<div align="center">

# 🎙️ Vocalendar

**Voice it. Done.**

Speak a task naturally. AI extracts the details. It lands in your Google Calendar — automatically.

![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue?style=for-the-badge)
[![License](https://img.shields.io/badge/License-AGPL%20v3-red?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11-yellow?style=for-the-badge&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

</div>

---

## What is Vocalendar?

Most task capture tools require typing. Vocalendar doesn't.

Say *"Remind me to call the doctor tomorrow at 3pm"* — Vocalendar transcribes it locally, uses AI to extract the task, date, time, and priority, shows you a confirmation card you can edit, then saves it directly to your Google Calendar with a reminder.

**The gap it solves:** The friction between "I need to remember this" and "it's actually in my calendar" is where tasks get lost. Vocalendar eliminates that gap.

---

## Features

- 🎙️ **Voice capture** — record directly in the browser, no app install needed
- 🧠 **AI extraction** — LLaMA 3.3 70B extracts task, date, time, and priority from natural speech
- ✅ **Confirmation step** — review and edit before anything is saved
- 📅 **Google Calendar sync** — events created automatically with reminders
- 🔔 **Browser notifications** — 30 minutes before every task
- 👥 **Multi-user** — each user connects their own Google Calendar
- 🔒 **Private by design** — voice recordings deleted immediately after transcription, tokens encrypted at rest
- 📱 **Responsive** — works on desktop and mobile

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| faster-whisper | Local audio transcription (base model, CPU) |
| Groq API (LLaMA 3.3 70B) | Task extraction from transcript |
| Google Calendar API | Event creation and availability checks |
| Clerk | JWT authentication middleware |
| Supabase (PostgreSQL) | Per-user data storage |
| cryptography (Fernet) | Google token encryption |
| slowapi | Rate limiting |
| ffmpeg | Audio format conversion (webm → wav) |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework |
| Tailwind CSS v3 | Styling |
| shadcn/ui | UI component library |
| Clerk React | Authentication (Google sign-in) |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptor |

---

## Architecture

```
Browser (React + Vite)
    │
    ├── MediaRecorder API → webm audio blob
    │
    ▼
FastAPI Backend
    │
    ├── /transcribe  → ffmpeg (webm→wav) → faster-whisper → transcript
    ├── /extract     → Groq LLaMA 3.3 70B → structured JSON
    ├── /calendar    → Google Calendar API → event created
    └── /auth        → Clerk JWT → Google OAuth PKCE → Supabase
    │
    ├── Supabase     → users, google_tokens (encrypted), tasks, audit_logs
    └── Google Cal   → events with reminders
```

---

## User Flow

```
/ Landing page
    ↓ Sign in with Google (Clerk)
/onboarding → Connect Google Calendar (first time only)
    ↓
/capture → Speak your task → Stop recording
    ↓ Whisper transcribes → Groq extracts
/confirm → Review extracted details → Edit if needed → Confirm
    ↓ Google Calendar event created + browser notification scheduled
/success → Confirmation screen → auto-returns to capture
    ↓
/tasks → Calendar view + List view of all tasks
```

---

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- [uv](https://astral.sh/uv) — Python package manager
- [ffmpeg](https://ffmpeg.org) — audio conversion
- [Groq API key](https://console.groq.com) — free tier available
- Google Cloud project with Calendar API enabled
- [Clerk](https://clerk.com) account
- [Supabase](https://supabase.com) project

### 1. Clone the repository

```bash
git clone https://github.com/Kushal1825/vocalendar.git
cd vocalendar
git checkout v2-multiuser
```

### 2. Install ffmpeg

**Windows:**
```powershell
winget install ffmpeg
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### 3. Backend setup

```bash
cd vocalender-backend

# create virtual environment
uv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# install dependencies
uv pip install -r requirements.txt
```

Create `vocalender-backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
GOOGLE_CLIENT_SECRETS_FILE=credentials/google_credentials.json
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback
OAUTHLIB_INSECURE_TRANSPORT=1
OAUTHLIB_RELAX_TOKEN_SCOPE=1
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
TOKEN_ENCRYPTION_KEY=your_fernet_encryption_key
```

Generate a Fernet encryption key:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 4. Google Cloud setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named `vocalendar`
3. Enable **Google Calendar API**
4. Create OAuth credentials → Web application
5. Add authorized redirect URI: `http://localhost:8000/auth/callback`
6. Download credentials JSON → save as `vocalender-backend/credentials/google_credentials.json`
7. Add your Gmail as a test user under OAuth consent screen → Data Access → Test Users

### 5. Supabase setup

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE google_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  token_uri TEXT,
  client_id TEXT,
  client_secret TEXT,
  scopes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium',
  calendar_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.google_tokens TO service_role;
GRANT ALL ON public.tasks TO service_role;

CREATE POLICY "service_role_all_users" ON public.users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_tokens" ON public.google_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_tasks" ON public.tasks FOR ALL TO service_role USING (true) WITH CHECK (true);
```

### 6. Frontend setup

```bash
cd vocalender-frontend
npm install
```

Create `vocalender-frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 7. Run both servers

**Terminal 1 — Backend:**
```bash
cd vocalender-backend
venv\Scripts\activate  # Windows
python -m uvicorn app.main:app --reload
# → http://localhost:8000
# → Swagger UI: http://localhost:8000/docs
```

**Terminal 2 — Frontend:**
```bash
cd vocalender-frontend
npm run dev
# → http://localhost:5173
```

### 8. First-time setup

1. Open `http://localhost:5173`
2. Click **Sign in with Google**
3. Click **Connect Google Calendar**
4. Grant calendar access
5. Allow browser notifications when prompted

---

## API Reference

All protected endpoints require `Authorization: Bearer {clerk_token}` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/transcribe` | Audio file → transcript (rate limited: 10/min) |
| POST | `/extract` | Transcript → structured task JSON |
| GET | `/auth/google` | Get Google OAuth URL |
| GET | `/auth/callback` | Google OAuth callback |
| GET | `/auth/status` | Check if calendar is connected |
| GET | `/auth/disconnect` | Disconnect Google Calendar |
| POST | `/calendar/create` | Create calendar event |
| GET | `/calendar/availability` | Check time slot availability |
| GET | `/tasks` | Get all user tasks |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete task from app and Google Calendar |

---

## Deployment

### Frontend → Vercel

1. Connect GitHub repo to Vercel
2. Set root directory: `vocalender-frontend`
3. Add environment variables:
   - `VITE_API_URL` — your Render backend URL
   - `VITE_CLERK_PUBLISHABLE_KEY`
4. Deploy

### Backend → Render

1. Connect GitHub repo to Render
2. Set root directory: `vocalender-backend`
3. Build command: `chmod +x build.sh && ./build.sh`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env`
6. Update `GOOGLE_REDIRECT_URI` to your Render URL + `/auth/callback`

After deploying:
- Add your Render URL to Google Cloud Console authorized redirect URIs
- Add your Vercel URL to Clerk allowed origins
- Update CORS in `main.py` to include your Vercel domain
- Add Privacy Policy URL to Google OAuth consent screen

---

## Security

- Google OAuth tokens encrypted at rest using Fernet (AES-128)
- Row Level Security enabled on all Supabase tables
- Clerk JWT verification on every protected endpoint
- Rate limiting on transcription endpoint (10 requests/minute/IP)
- File upload validation — type and size checks
- Voice recordings deleted immediately after transcription
- No secrets committed to repository

---

## Project Structure

```
vocalendar/
├── vocalender-backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, routers
│   │   ├── config.py            # Settings, env validation
│   │   ├── routes/              # API endpoints
│   │   │   ├── transcribe.py    # POST /transcribe
│   │   │   ├── extract.py       # POST /extract
│   │   │   ├── calendar.py      # Calendar + task endpoints
│   │   │   └── auth.py          # Google OAuth PKCE flow
│   │   ├── services/            # Business logic
│   │   │   ├── whisper_service.py
│   │   │   ├── llm_service.py
│   │   │   ├── calendar_service.py
│   │   │   └── supabase_service.py
│   │   ├── middleware/
│   │   │   └── clerk_auth.py    # JWT verification
│   │   └── utils/
│   │       └── audio.py         # webm → wav conversion
│   ├── credentials/             # Google credentials (gitignored)
│   ├── build.sh                 # Render build script
│   └── requirements.txt
│
└── vocalender-frontend/
    └── src/
        ├── pages/               # One file per screen
        ├── components/          # Reusable UI components
        ├── hooks/               # Custom React hooks
        ├── services/            # API call functions
        ├── store/               # Shared state
        ├── constants/           # Routes, config
        └── utils/               # Helper functions
```

---

## Known Limitations

- Render free tier has ~30-50 second cold start after inactivity
- faster-whisper `base` model may occasionally mishear heavily accented speech
- Google OAuth requires manual re-authentication if refresh token expires
- Browser notifications only fire while the browser tab is open

---

## Roadmap

- [ ] V2.1 — TTS voice responses ("Added meeting with Rahul at 3pm")
- [ ] V2.2 — Query calendar by voice ("What do I have tomorrow?")
- [ ] V2.3 — Alter existing events by voice ("Move Friday meeting to 4pm")
- [ ] V2.4 — Conflict detection with alternative time suggestions
- [ ] V3.0 — Agentic tool-calling with ReAct loop

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)** 
with additional commercial use restrictions.

- ✅ You may view, study, and fork this code
- ✅ You may use it for personal, non-commercial purposes
- ✅ You may modify it — but must open source your changes under AGPL v3
- ❌ Commercial use requires written permission from the author
- ❌ You may not rebrand and redistribute as your own product

For commercial licensing: kushalkalsariya1825@gmail.com

See [LICENSE](LICENSE) for full terms.

---

## Author

Built by **Kushal** — M.Sc. Automotive Software Engineering student at TU Chemnitz, Germany.

- GitHub: [@Kushal1825](https://github.com/Kushal1825)
- Email: kushalkalsariya1825@gmail.com

---

<div align="center">
  <p>If this project helped you, consider giving it a ⭐</p>
</div>