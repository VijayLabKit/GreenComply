from fastapi import APIRouter, Depends

from app.config import SUPABASE_CONFIGURED
from app.db import get_supabase
from app.auth import get_current_user
from app.models import CompanyProfileUpdate
from app.mock_data import COMPANY

router = APIRouter(prefix="/api/company", tags=["company"])


@router.get("/profile")
def get_profile(user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("companies").select("*").eq("id", user["company_id"]).single().execute()
        return result.data
    return COMPANY


@router.put("/profile")
def update_profile(body: CompanyProfileUpdate, user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("companies").update(updates).eq("id", user["company_id"]).execute()
        return result.data[0]
    return {**COMPANY, **updates}
