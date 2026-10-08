import io
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse

from app.config import SUPABASE_CONFIGURED
from app.db import get_supabase
from app.auth import get_current_user
from app.mock_data import (
    DOCUMENTS, _documents_state, next_document_id, log_activity,
)

router = APIRouter(prefix="/api/documents", tags=["documents"])

# In demo mode (no Supabase) uploaded bytes are kept in-process so the
# download button returns the real file the user uploaded.
_upload_store: dict[int, bytes] = {}


@router.get("")
def list_documents(user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("documents").select("*").eq("company_id", user["company_id"]).order("date", desc=True).execute()
        return result.data
    return _documents_state


@router.post("/upload")
async def upload_document(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    raw = await file.read()
    record = {
        "company_id": user["company_id"],
        "name": file.filename,
        "type": "Evidence",
        "version": "v1",
        "date": date.today().isoformat(),
    }
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        # Binary bytes would be pushed to Supabase Storage here; the row below
        # tracks metadata in Postgres for the Documents vault list view.
        result = sb.table("documents").insert(record).execute()
        created = result.data[0]
    else:
        created = {"id": next_document_id(), **record}
        _upload_store[created["id"]] = raw
        _documents_state.insert(0, created)
    log_activity(f"Document uploaded: {file.filename}")
    return created


@router.get("/{document_id}/download")
def download_document(document_id: int, user: dict = Depends(get_current_user)):
    """
    Streams the uploaded bytes (demo mode) or a metadata summary file when
    binaries live in Supabase Storage / were seeded.
    """
    filename = "document.txt"
    payload: bytes | None = _upload_store.get(document_id)

    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("documents").select("*").eq("id", document_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Document not found")
        doc = result.data[0]
        filename = doc["name"]
        if payload is None:
            summary = (
                f"GreenComply compliance vault\n"
                f"Document: {doc['name']}\n"
                f"Type: {doc.get('type')}\n"
                f"Version: {doc.get('version')}\n"
                f"Date: {doc.get('date')}\n\n"
                f"Binary content is stored in Supabase Storage (storage_path: "
                f"{doc.get('storage_path')}). Connect Storage to download the original file."
            )
            payload = summary.encode()
    else:
        doc = next((d for d in _documents_state if d["id"] == document_id), None)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        filename = doc["name"]
        if payload is None:
            summary = (
                f"GreenComply compliance vault\n"
                f"Document: {doc['name']}\n"
                f"Type: {doc['type']}\n"
                f"Version: {doc['version']}\n"
                f"Date: {doc['date']}\n\n"
                f"(Seeded demo document — metadata only.)"
            )
            payload = summary.encode()
        log_activity(f"Document downloaded: {filename}")

    return StreamingResponse(
        iter([payload]),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.delete("/{document_id}")
def delete_document(document_id: int, user: dict = Depends(get_current_user)):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("documents").delete().eq("id", document_id).eq("company_id", user["company_id"]).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Document not found")
        deleted = result.data[0]
    else:
        idx = next((i for i, d in enumerate(_documents_state) if d["id"] == document_id), None)
        if idx is None:
            raise HTTPException(status_code=404, detail="Document not found")
        deleted = _documents_state.pop(idx)
        _upload_store.pop(document_id, None)
    log_activity(f"Document deleted: {deleted['name']}")
    return {"deleted": True, "id": document_id}
