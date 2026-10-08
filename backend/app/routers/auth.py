from fastapi import APIRouter, HTTPException

from app.config import SUPABASE_CONFIGURED
from app.db import get_supabase
from app.models import SignupRequest, LoginRequest, TokenResponse
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
def signup(body: SignupRequest):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        existing = sb.table("users").select("id").eq("email", body.email).execute()
        if existing.data:
            raise HTTPException(status_code=409, detail="An account with this email already exists")

        company = sb.table("companies").insert({
            "name": body.companyName,
            "gstin": body.gstin,
            "sector": body.sector,
            "export_status": body.exportStatus,
        }).execute()
        company_id = company.data[0]["id"]

        user = sb.table("users").insert({
            "email": body.email,
            "password_hash": hash_password(body.password),
            "company_id": company_id,
            "role": "Admin",
        }).execute()
        user_id = user.data[0]["id"]
        token = create_access_token(subject=str(user_id), extra={"company_id": company_id, "role": "Admin"})
        return TokenResponse(token=token)

    # Demo mode: no persistence, just issue a valid token so onboarding can proceed.
    token = create_access_token(subject=body.email, extra={"company_id": "c1", "role": "Admin"})
    return TokenResponse(token=token)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    if SUPABASE_CONFIGURED:
        sb = get_supabase()
        result = sb.table("users").select("*").eq("email", body.email).execute()
        if not result.data or not verify_password(body.password, result.data[0]["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        user = result.data[0]
        token = create_access_token(subject=str(user["id"]), extra={"company_id": user["company_id"], "role": user["role"]})
        return TokenResponse(token=token)

    # Demo mode: any credentials sign in as the seeded demo company.
    token = create_access_token(subject=body.email, extra={"company_id": "c1", "role": "Admin"})
    return TokenResponse(token=token)
