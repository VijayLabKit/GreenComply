"""
Populates a connected Supabase project with a full 12-month demo dataset for
a fictional exporter, "Himalayan Steel Works Pvt. Ltd." Run once after
applying database/schema.sql:

    cd backend
    python -m app.seed

Requires SUPABASE_URL and SUPABASE_KEY (service role key, so RLS doesn't
block inserts) in backend/.env.
"""

from datetime import datetime, timedelta, timezone

from app.config import SUPABASE_CONFIGURED
from app.db import get_supabase
from app.auth import hash_password
from app.mock_data import (
    COMPANY, EMISSIONS_TREND, BRSR_CATEGORY_SCORES, BRSR_PRINCIPLES,
    CBAM_SHIPMENTS, SUPPLIERS, DOCUMENTS, DATA_SOURCES, EMISSION_FACTORS,
    KPIS, DEADLINES, ACTIVITY_FEED,
)

DEMO_EMAIL = "vijay@himalayansteel.example"
DEMO_PASSWORD = "greencomply-demo"


def _ago(**kwargs) -> str:
    return (datetime.now(timezone.utc) - timedelta(**kwargs)).isoformat()


def seed():
    if not SUPABASE_CONFIGURED:
        raise SystemExit(
            "SUPABASE_URL / SUPABASE_KEY are not set in backend/.env — "
            "nothing to seed. Copy .env.example to .env and fill in your "
            "Supabase project credentials first."
        )

    sb = get_supabase()
    print("Seeding GreenComply demo data into Supabase…")

    company = sb.table("companies").insert({
        "name": COMPANY["name"],
        "gstin": COMPANY["gstin"],
        "sector": COMPANY["sector"],
        "location": COMPANY["location"],
        "export_status": COMPANY["export_status"],
        "plan": COMPANY["plan"],
        "employees": COMPANY["employees"],
        "turnover_cr": COMPANY["turnover_cr"],
    }).execute()
    company_id = company.data[0]["id"]
    print(f"  companies: 1 row (id={company_id})")

    sb.table("users").insert({
        "company_id": company_id,
        "email": DEMO_EMAIL,
        "password_hash": hash_password(DEMO_PASSWORD),
        "role": "Admin",
    }).execute()
    print(f"  users: 1 row ({DEMO_EMAIL} / {DEMO_PASSWORD})")

    sb.table("data_source_status").insert([
        {
            "company_id": company_id,
            "category": d["id"],
            "completeness": d["completeness"],
            "last_updated": d["lastUpdated"],
        }
        for d in DATA_SOURCES
    ]).execute()
    print(f"  data_source_status: {len(DATA_SOURCES)} rows")

    sb.table("emission_records").insert([
        {
            "company_id": company_id,
            "facility": "Siliguri Plant A",
            "period": row["month"],
            "scope1": row["scope1"],
            "scope2": row["scope2"],
            "scope3": row["scope3"],
        }
        for row in EMISSIONS_TREND
    ]).execute()
    print(f"  emission_records: {len(EMISSIONS_TREND)} rows (12 months)")

    sb.table("emission_factors").insert(EMISSION_FACTORS).execute()
    print(f"  emission_factors: {len(EMISSION_FACTORS)} rows")

    completeness = round(sum(p["completeness"] for p in BRSR_PRINCIPLES) / len(BRSR_PRINCIPLES))
    sb.table("brsr_reports").insert({
        "company_id": company_id,
        "status": "draft",
        "completeness": completeness,
        "category_scores": BRSR_CATEGORY_SCORES,
        "principles": BRSR_PRINCIPLES,
    }).execute()
    print(f"  brsr_reports: 1 row ({completeness}% complete)")

    sb.table("cbam_declarations").insert([
        {
            "company_id": company_id,
            "shipment_ref": s["id"],
            "product": s["product"],
            "tonnes": s["tonnes"],
            "emissions_per_tonne": s["emissionsPerTonne"],
            "carbon_cost": s["carbonCost"],
            "status": s["status"],
        }
        for s in CBAM_SHIPMENTS
    ]).execute()
    print(f"  cbam_declarations: {len(CBAM_SHIPMENTS)} rows (incl. 1 overdue)")

    sb.table("suppliers").insert([
        {
            "company_id": company_id,
            "name": s["name"],
            "material": s["material"],
            "distance_km": s["distanceKm"],
            "sustainability_score": s["sustainabilityScore"],
            "flag": s["flag"],
        }
        for s in SUPPLIERS
    ]).execute()
    print(f"  suppliers: {len(SUPPLIERS)} rows ({sum(1 for s in SUPPLIERS if s['flag'])} flagged)")

    sb.table("documents").insert([
        {
            "company_id": company_id,
            "name": d["name"],
            "type": d["type"],
            "version": d["version"],
            "date": d["date"],
        }
        for d in DOCUMENTS
    ]).execute()
    print(f"  documents: {len(DOCUMENTS)} rows")

    sb.table("dashboard_kpis").insert({
        "company_id": company_id,
        "compliance_score": KPIS["complianceScore"],
        "total_emissions": KPIS["totalEmissions"],
        "emissions_trend_pct": KPIS["emissionsTrendPct"],
        "reports_due": KPIS["reportsDue"],
        "next_deadline": KPIS["nextDeadline"],
        "risk_flags": KPIS["riskFlags"],
    }).execute()
    print("  dashboard_kpis: 1 row")

    sb.table("deadlines").insert([
        {"company_id": company_id, "label": d["label"], "date": d["date"], "days_left": d["daysLeft"]}
        for d in DEADLINES
    ]).execute()
    print(f"  deadlines: {len(DEADLINES)} rows (incl. 1 overdue)")

    # Activity feed: stagger created_at so the feed shows varied, realistic
    # timestamps instead of everything landing at seed time.
    sb.table("activity_log").insert([
        {"company_id": company_id, "text": a["text"], "created_at": a.get("created_at") or _ago(hours=24 * i)}
        for i, a in enumerate(ACTIVITY_FEED)
    ]).execute()
    print(f"  activity_log: {len(ACTIVITY_FEED)} rows")

    print("\nDone. Log in with:")
    print(f"  email:    {DEMO_EMAIL}")
    print(f"  password: {DEMO_PASSWORD}")


if __name__ == "__main__":
    seed()
