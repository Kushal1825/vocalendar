from supabase import create_client, Client
from app.config import settings
from cryptography.fernet import Fernet
import json
from datetime import datetime

# use settings instead of os.getenv directly
fernet = Fernet(settings.TOKEN_ENCRYPTION_KEY.encode())

supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_KEY
)

def get_or_create_user(clerk_user_id: str, email: str):
    existing = supabase.table("users").select("*").eq("id", clerk_user_id).execute()
    
    if existing.data:
        return existing.data[0]
    
    new_user = supabase.table("users").insert({
        "id": clerk_user_id,
        "email": email
    }).execute()
    
    return new_user.data[0]


def save_google_tokens(clerk_user_id: str, tokens: dict):
    # delete old tokens first
    supabase.table("google_tokens").delete().eq("user_id", clerk_user_id).execute()
    
    # insert new tokens
    result = supabase.table("google_tokens").insert({
        "user_id": clerk_user_id,
        **tokens
    }).execute()
    
    return result.data[0]


def get_google_tokens(clerk_user_id: str):
    result = supabase.table("google_tokens").select("*").eq("user_id", clerk_user_id).execute()
    
    if not result.data:
        return None
    
    return result.data[0]


def save_task(clerk_user_id: str, task_name: str, scheduled_at: str, priority: str, calendar_event_id: str):
    result = supabase.table("tasks").insert({
        "user_id": clerk_user_id,
        "task_name": task_name,
        "scheduled_at": scheduled_at,
        "priority": priority,
        "calendar_event_id": calendar_event_id
    }).execute()
    
    return result.data[0]


def get_user_tasks(clerk_user_id: str):
    result = supabase.table("tasks").select("*").eq("user_id", clerk_user_id).order("scheduled_at").execute()
    return result.data

def log_action(user_id: str, action: str, details: dict = {}):
    supabase.table("audit_logs").insert({
        "user_id": user_id,
        "action": action,
        "details": json.dumps(details),
        "created_at": datetime.now().isoformat()
    }).execute()

def update_task(clerk_user_id: str, task_id: str, updates: dict):
    result = supabase.table("tasks").update(updates).eq("id", task_id).eq("user_id", clerk_user_id).execute()
    return result.data[0] if result.data else None

def delete_task(clerk_user_id: str, task_id: str):
    supabase.table("tasks").delete().eq("id", task_id).eq("user_id", clerk_user_id).execute()

def delete_google_tokens(clerk_user_id: str):
    supabase.table("google_tokens").delete().eq("user_id", clerk_user_id).execute()