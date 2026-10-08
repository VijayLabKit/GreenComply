from typing import Optional
from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    companyName: str
    gstin: str
    sector: str
    email: EmailStr
    password: str
    exportStatus: bool = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    token: str
    token_type: str = "bearer"


class DataEntryRequest(BaseModel):
    facility: str
    period: str
    value: float
    unit: Optional[str] = None


class SupplierCreateRequest(BaseModel):
    name: str
    material: str
    distanceKm: float = 0
    sustainabilityScore: int = 50


class CompanyProfileUpdate(BaseModel):
    name: Optional[str] = None
    gstin: Optional[str] = None
    sector: Optional[str] = None
    location: Optional[str] = None
