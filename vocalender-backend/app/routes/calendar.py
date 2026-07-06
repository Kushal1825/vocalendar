# app/routes/calendar.py

from fastapi import APIRouter, HTTPException, Depends
from app.services.calendar_service import create_event, check_availability
from app.middleware.clerk_auth import get_current_user
from app.services.supabase_service import save_task,get_user_tasks

router = APIRouter()


@router.post("/calendar/create")
async def create_calendar_event(
    payload: dict,
    current_user: dict = Depends(get_current_user)
):
    try:
        result = create_event(
            user_id=current_user["user_id"],
            task=payload["task"],
            start_datetime=payload["start_datetime"],
            end_datetime=payload["end_datetime"],
            priority=payload.get("priority", "medium"),
            timezone=payload.get("timezone", "UTC")
        )

        # save task to supabase
        save_task(
            clerk_user_id=current_user["user_id"],
            task_name=payload["task"],
            scheduled_at=payload["start_datetime"],
            priority=payload.get("priority", "medium"),
            calendar_event_id=result["event_id"]
        )

        return result

    except Exception as e:
        print("CALENDAR ERROR:", str(e))
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/calendar/availability")
async def get_availability(
    date: str,
    time: str,
    duration: int = 60,
    current_user: dict = Depends(get_current_user)
):
    try:
        return check_availability(current_user["user_id"], date, time, duration)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/tasks")
async def get_tasks(current_user: dict = Depends(get_current_user)):
    try:
        tasks = get_user_tasks(current_user["user_id"])
        return {"tasks": tasks}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.put("/tasks/{task_id}")
async def update_task_route(
    task_id: str,
    payload: dict,
    current_user: dict = Depends(get_current_user)
):
    try:
        from app.services.supabase_service import update_task
        result = update_task(
            clerk_user_id=current_user["user_id"],
            task_id=task_id,
            updates={
                "task_name": payload.get("task_name"),
                "scheduled_at": payload.get("scheduled_at"),
                "priority": payload.get("priority")
            }
        )
        return {"message": "Task updated", "task": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.delete("/tasks/{task_id}")
async def remove_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        from app.services.supabase_service import get_task_by_id, delete_task
        from app.services.calendar_service import delete_event

        # get task first to find calendar_event_id
        task = get_task_by_id(current_user["user_id"], task_id)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        # delete from Google Calendar if event_id exists
        if task.get("calendar_event_id"):
            try:
                delete_event(current_user["user_id"], task["calendar_event_id"])
            except Exception as cal_err:
                # log but don't fail — event may already be deleted in Google
                print(f"Calendar delete warning: {cal_err}")

        # delete from Supabase
        delete_task(current_user["user_id"], task_id)

        return {"message": "Task deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))