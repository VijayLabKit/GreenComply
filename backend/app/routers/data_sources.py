import csv
import io

from fastapi import APIRouter, Depends, UploadFile, File

from app.config import SUPABASE_CONFIGURED
from app.db import get_supabase
from app.auth import get_current_user
from app.models import DataEntryRequest
from app.mock_data import _data_source_state, bump_completeness, log_activity

router = APIRouter(prefix="/api/data-sources", tags=["data-sources"])


@router.get("")
def list_data_sources(user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("data_source_status").select("*").eq("company_id", user["company_id"]).execute()
        return result.data
    return _data_source_state


@router.post("/{type}/entry")
def add_entry(type: str, body: DataEntryRequest, user: dict = Depends(get_current_user)):
    record = {
        "company_id": user["company_id"],
        "category": type,
        "facility": body.facility,
        "period": body.period,
        "value": body.value,
        "unit": body.unit,
    }
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("data_entries").insert(record).execute()
        created = result.data[0]
    else:
        created = {"id": "demo-entry", **record}
    bump_completeness(type, 2)
    log_activity(f"Manual entry saved for {type} ({body.period}: {body.value} {body.unit or ''})")
    return created


@router.post("/{type}/upload")
async def upload_csv(type: str, file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    raw = await file.read()
    reader = csv.DictReader(io.StringIO(raw.decode("utf-8", errors="ignore")))
    rows = list(reader)

    if SUPABASE_CONFIGURED and rows:
        sb = get_supabase()
        records = [
            {"company_id": user["company_id"], "category": type, **row}
            for row in rows
        ]
        sb.table("data_entries").insert(records).execute()

    if rows:
        bump_completeness(type, 5)
    log_activity(f"CSV uploaded for {type} — {len(rows)} rows imported")

    return {"category": type, "rows_parsed": len(rows), "preview": rows[:10]}
