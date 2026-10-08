from fastapi import APIRouter, Depends, HTTPException

from app.config import SUPABASE_CONFIGURED
from app.db import get_supabase
from app.auth import get_current_user
from app.models import SupplierCreateRequest
from app.mock_data import (
    SUPPLIERS, _suppliers_state, next_supplier_id, log_activity,
)

router = APIRouter(prefix="/api/suppliers", tags=["suppliers"])


@router.get("")
def list_suppliers(user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("suppliers").select("*").eq("company_id", user["company_id"]).order("name").execute()
        return result.data
    return _suppliers_state


@router.post("")
def create_supplier(body: SupplierCreateRequest, user: dict = Depends(get_current_user)):
    record = {
        "company_id": user["company_id"],
        "name": body.name,
        "material": body.material,
        "distance_km": body.distanceKm,
        "sustainability_score": body.sustainabilityScore,
        "flag": body.sustainabilityScore < 50,
    }
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("suppliers").insert(record).execute()
        created = result.data[0]
    else:
        created = {"id": next_supplier_id(), **record}
        _suppliers_state.append(created)
    log_activity(f"Supplier \"{body.name}\" added to the directory")
    return created


@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("suppliers").delete().eq("id", supplier_id).eq("company_id", user["company_id"]).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Supplier not found")
        deleted = result.data[0]
    else:
        idx = next((i for i, s in enumerate(_suppliers_state) if s["id"] == supplier_id), None)
        if idx is None:
            raise HTTPException(status_code=404, detail="Supplier not found")
        deleted = _suppliers_state.pop(idx)
    log_activity(f"Supplier \"{deleted['name']}\" removed from the directory")
    return {"deleted": True, "id": supplier_id}


@router.get("/{supplier_id}/score")
def supplier_score(supplier_id: int, user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("suppliers").select("*").eq("id", supplier_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Supplier not found")
        return {"id": supplier_id, "sustainabilityScore": result.data["sustainability_score"]}
    match = next((s for s in SUPPLIERS if s["id"] == supplier_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return {"id": supplier_id, "sustainabilityScore": match["sustainabilityScore"]}
