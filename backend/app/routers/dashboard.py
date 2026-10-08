from fastapi import APIRouter, Depends

from app.config import SUPABASE_CONFIGURED
from app.db import get_supabase
from app.auth import get_current_user
from app.mock_data import KPIS, DEADLINES, _activity_state

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/kpis")
def kpis(user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("dashboard_kpis").select("*").eq("company_id", user["company_id"]).single().execute()
        if result.data:
            return result.data
    return KPIS


@router.get("/deadlines")
def deadlines(user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("deadlines").select("*").eq("company_id", user["company_id"]).order("date").execute()
        return result.data
    return DEADLINES


@router.get("/activity")
def activity(user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("activity_log").select("*").eq("company_id", user["company_id"]).order("created_at", desc=True).limit(20).execute()
        return result.data
    return _activity_state
