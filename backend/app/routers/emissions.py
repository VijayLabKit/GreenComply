from fastapi import APIRouter, Depends

from app.config import SUPABASE_CONFIGURED
from app.db import get_supabase
from app.auth import get_current_user
from app.mock_data import (
    EMISSIONS_TREND, SCOPE_BREAKDOWN, FACILITY_EMISSIONS,
    EMISSION_FACTORS, RECOMMENDATIONS, KPIS,
)

router = APIRouter(prefix="/api/emissions", tags=["emissions"])


@router.get("/summary")
def summary(user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("emission_records").select("*").eq("company_id", user["company_id"]).execute()
        total = sum(r.get("co2e_tonnes", 0) for r in result.data)
        return {"totalEmissions": total, "scopeBreakdown": SCOPE_BREAKDOWN, "facilityEmissions": FACILITY_EMISSIONS}
    return {
        "totalEmissions": KPIS["totalEmissions"],
        "scopeBreakdown": SCOPE_BREAKDOWN,
        "facilityEmissions": FACILITY_EMISSIONS,
        "emissionFactors": EMISSION_FACTORS,
        "recommendations": RECOMMENDATIONS,
    }


@router.get("/trend")
def trend(user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("emission_records").select("*").eq("company_id", user["company_id"]).order("period").execute()
        return result.data
    return EMISSIONS_TREND


@router.get("/scope-breakdown")
def scope_breakdown(user: dict = Depends(get_current_user)):
    return SCOPE_BREAKDOWN
