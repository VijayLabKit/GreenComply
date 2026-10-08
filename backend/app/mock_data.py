"""
Realistic seeded demo data for a fictional exporter, "Himalayan Steel Works
Pvt. Ltd." (Siliguri, West Bengal). Mirrors database/schema.sql and is used
as the response source whenever Supabase credentials aren't configured, so
the API always returns a fully populated demo.

The dataset is deliberately imperfect — an overdue CBAM declaration, a
supplier with no data at all, and BRSR principles under 50% complete — so
the dashboard's compliance score and risk flags are visibly justified by the
underlying data instead of looking hardcoded.
"""

from datetime import datetime, timedelta, timezone


def _ago(**kwargs) -> str:
    """ISO timestamp relative to process start, so activity-feed times look live."""
    return (datetime.now(timezone.utc) - timedelta(**kwargs)).isoformat()


COMPANY = {
    "id": "c1",
    "name": "Himalayan Steel Works Pvt. Ltd.",
    "gstin": "19AABCH1234Q1ZP",
    "sector": "Steel & Cement Manufacturing",
    "location": "Siliguri, West Bengal, India",
    "export_status": True,
    "plan": "Export-Ready",
    "employees": 412,
    "turnover_cr": 186.4,
}

MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]

EMISSIONS_TREND = [
    {"month": "Oct", "scope1": 208, "scope2": 336, "scope3": 176},
    {"month": "Nov", "scope1": 224, "scope2": 352, "scope3": 191},
    {"month": "Dec", "scope1": 262, "scope2": 412, "scope3": 206},
    {"month": "Jan", "scope1": 243, "scope2": 391, "scope3": 199},
    {"month": "Feb", "scope1": 212, "scope2": 361, "scope3": 184},
    {"month": "Mar", "scope1": 233, "scope2": 378, "scope3": 197},
    {"month": "Apr", "scope1": 249, "scope2": 403, "scope3": 212},
    {"month": "May", "scope1": 276, "scope2": 431, "scope3": 226},
    {"month": "Jun", "scope1": 292, "scope2": 457, "scope3": 238},
    {"month": "Jul", "scope1": 271, "scope2": 419, "scope3": 221},
    {"month": "Aug", "scope1": 253, "scope2": 402, "scope3": 214},
    {"month": "Sep", "scope1": 245, "scope2": 395, "scope3": 208},
]

KPIS = {
    "complianceScore": 74,
    "totalEmissions": 3520,
    "emissionsTrendPct": 4.2,
    "reportsDue": 3,
    "nextDeadline": "CBAM Q3 declaration — overdue",
    "riskFlags": 6,
}

BRSR_CATEGORY_SCORES = [
    {"category": "Environment", "score": 82},
    {"category": "Social", "score": 64},
    {"category": "Governance", "score": 79},
]

DEADLINES = [
    {"label": "CBAM Quarterly Declaration (EU)", "date": "2026-09-30", "daysLeft": -8},
    {"label": "Scope 3 Supplier Data Refresh", "date": "2026-10-15", "daysLeft": 7},
    {"label": "BRSR Annual Filing (SEBI)", "date": "2026-10-26", "daysLeft": 18},
    {"label": "ISO 14001 Surveillance Audit", "date": "2026-11-12", "daysLeft": 35},
]

ACTIVITY_FEED = [
    {"id": 1, "text": "Q3 electricity data uploaded for all 4 facilities", "created_at": _ago(hours=2)},
    {"id": 2, "text": "CBAM declaration exported for Shipment #CB-1042", "created_at": _ago(days=1, hours=3)},
    {"id": 3, "text": "Supplier \"Sikkim Graphite Works\" flagged — no emissions data received since onboarding", "created_at": _ago(days=1, hours=9)},
    {"id": 4, "text": "BRSR Section C, Principle 6 auto-populated from utility data", "created_at": _ago(days=2, hours=5)},
    {"id": 5, "text": "Fuel consumption log updated for September", "created_at": _ago(days=3)},
    {"id": 6, "text": "Water usage reading for August missing at Cooch Behar Depot — reminder sent", "created_at": _ago(days=4, hours=6)},
    {"id": 7, "text": "ISO 14001 surveillance audit scheduled for 12 Nov", "created_at": _ago(days=5, hours=2)},
    {"id": 8, "text": "New supplier \"Meghalaya Lime Exports\" added and auto-flagged (score 33)", "created_at": _ago(days=6)},
    {"id": 9, "text": "BRSR report regenerated — completeness dropped to 76% after Section G edits", "created_at": _ago(days=7, hours=4)},
    {"id": 10, "text": "Waste manifest uploaded for Plant B (hazardous, Aug)", "created_at": _ago(days=8, hours=7)},
    {"id": 11, "text": "Supplier audit completed for Terai Alloys Pvt Ltd", "created_at": _ago(days=10)},
    {"id": 12, "text": "July CBAM declaration submitted to EU portal", "created_at": _ago(days=12, hours=5)},
]

DATA_SOURCES = [
    {"id": "electricity", "name": "Electricity Bills", "completeness": 100, "lastUpdated": "2026-09-18"},
    {"id": "fuel", "name": "Fuel Consumption", "completeness": 92, "lastUpdated": "2026-09-17"},
    {"id": "water", "name": "Water Usage", "completeness": 84, "lastUpdated": "2026-09-14"},
    {"id": "waste", "name": "Waste Generated", "completeness": 71, "lastUpdated": "2026-09-10"},
    {"id": "raw_material", "name": "Raw Material Sourcing", "completeness": 95, "lastUpdated": "2026-09-16"},
    {"id": "labor", "name": "Employee / Labor Data", "completeness": 100, "lastUpdated": "2026-09-01"},
    {"id": "transport", "name": "Transport / Logistics", "completeness": 58, "lastUpdated": "2026-09-05"},
]

BRSR_PRINCIPLES = [
    {"id": 1, "title": "Ethics, Transparency & Accountability", "completeness": 95},
    {"id": 2, "title": "Safe & Sustainable Products", "completeness": 88},
    {"id": 3, "title": "Employee Wellbeing", "completeness": 90},
    {"id": 4, "title": "Stakeholder Responsiveness", "completeness": 62},
    {"id": 5, "title": "Human Rights", "completeness": 55},
    {"id": 6, "title": "Environment Protection", "completeness": 91},
    {"id": 7, "title": "Public & Regulatory Policy", "completeness": 84},
    {"id": 8, "title": "Inclusive Growth", "completeness": 42},
    {"id": 9, "title": "Consumer Value", "completeness": 76},
]

CBAM_SHIPMENTS = [
    {"id": "CB-1036", "product": "Cement (Clinker)", "tonnes": 480, "emissionsPerTonne": 0.86, "carbonCost": 8140, "status": "Submitted", "declarationDue": "2026-07-31"},
    {"id": "CB-1039", "product": "Steel (Rebar)", "tonnes": 210, "emissionsPerTonne": 1.85, "carbonCost": 6935, "status": "Submitted", "declarationDue": "2026-07-31"},
    {"id": "CB-1041", "product": "Aluminum Sheet", "tonnes": 95, "emissionsPerTonne": 11.5, "carbonCost": 19412, "status": "Ready", "declarationDue": "2026-10-31"},
    {"id": "CB-1042", "product": "Steel (Coil)", "tonnes": 160, "emissionsPerTonne": 1.9, "carbonCost": 5432, "status": "Draft", "declarationDue": "2026-10-31"},
    {"id": "CB-1047", "product": "Cement (Portland)", "tonnes": 320, "emissionsPerTonne": 0.79, "carbonCost": 5875, "status": "Overdue", "declarationDue": "2026-09-30"},
    {"id": "CB-1048", "product": "Steel (Billets)", "tonnes": 240, "emissionsPerTonne": 1.72, "carbonCost": 8490, "status": "Draft", "declarationDue": "2026-10-31"},
]

SCOPE_BREAKDOWN = [
    {"name": "Scope 1 — Direct", "value": 245},
    {"name": "Scope 2 — Purchased Energy", "value": 395},
    {"name": "Scope 3 — Value Chain", "value": 208},
]

FACILITY_EMISSIONS = [
    {"facility": "Siliguri Plant A", "emissions": 480},
    {"facility": "Siliguri Plant B", "emissions": 210},
    {"facility": "Logistics Fleet", "emissions": 93},
    {"facility": "Jalpaiguri Warehouse", "emissions": 65},
    {"facility": "Cooch Behar Depot", "emissions": 38},
]

EMISSION_FACTORS = [
    {"source": "Grid Electricity (WBSEDCL)", "factor": "0.82 kgCO2e / kWh"},
    {"source": "Diesel (Generators)", "factor": "2.68 kgCO2e / litre"},
    {"source": "Coal (Furnace)", "factor": "2.42 kgCO2e / kg"},
    {"source": "Natural Gas", "factor": "2.02 kgCO2e / m3"},
    {"source": "Road Freight (Diesel HGV)", "factor": "0.12 kgCO2e / tonne-km"},
]

RECOMMENDATIONS = [
    "Switching 20% grid load to rooftop solar could cut Scope 2 emissions by ~340 tCO2e/year.",
    "Upgrading furnace insulation at Plant A could reduce coal use by 8-12%.",
    "Consolidating logistics routes to Cooch Behar could cut Scope 3 transport emissions by ~15%.",
    "Chasing missing fuel logs from the Logistics Fleet would lift data completeness above 95%.",
]

# 14 suppliers, mixed risk. "Sikkim Graphite Works" has received no data at
# all (score 0) — a deliberate edge case so the risk dashboard is justified.
SUPPLIERS = [
    {"id": 1,  "name": "Terai Alloys Pvt Ltd",         "material": "Steel Billets",          "distanceKm": 42,  "sustainabilityScore": 62, "flag": False},
    {"id": 2,  "name": "Dooars Coal Traders",          "material": "Coal",                   "distanceKm": 120, "sustainabilityScore": 38, "flag": True},
    {"id": 3,  "name": "Kanchenjunga Limestone Co.",   "material": "Limestone",              "distanceKm": 65,  "sustainabilityScore": 74, "flag": False},
    {"id": 4,  "name": "Northline Freight Services",   "material": "Logistics",              "distanceKm": 0,   "sustainabilityScore": 55, "flag": False},
    {"id": 5,  "name": "Balurghat Packaging Ltd",      "material": "Packaging",              "distanceKm": 88,  "sustainabilityScore": 80, "flag": False},
    {"id": 6,  "name": "Bengal Ferro Alloys",          "material": "Ferro Alloys",           "distanceKm": 156, "sustainabilityScore": 45, "flag": True},
    {"id": 7,  "name": "Teesta Water Solutions",       "material": "Process Water Treatment","distanceKm": 12,  "sustainabilityScore": 91, "flag": False},
    {"id": 8,  "name": "Himalayan Aluminum Casting",   "material": "Aluminum Sheet",         "distanceKm": 210, "sustainabilityScore": 58, "flag": True},
    {"id": 9,  "name": "Siliguri Cement Works",        "material": "Clinker",                "distanceKm": 28,  "sustainabilityScore": 71, "flag": False},
    {"id": 10, "name": "Assam Refractory Supplies",    "material": "Refractory Bricks",      "distanceKm": 340, "sustainabilityScore": 49, "flag": True},
    {"id": 11, "name": "Meghalaya Lime Exports",       "material": "Quicklime",              "distanceKm": 275, "sustainabilityScore": 33, "flag": True},
    {"id": 12, "name": "Ganga Energy Corp",            "material": "Grid Electricity",       "distanceKm": 0,   "sustainabilityScore": 84, "flag": False},
    {"id": 13, "name": "Dooars Timber & Pallets",      "material": "Wooden Pallets",         "distanceKm": 95,  "sustainabilityScore": 68, "flag": False},
    {"id": 14, "name": "Sikkim Graphite Works",        "material": "Graphite Electrodes",    "distanceKm": 410, "sustainabilityScore": 0,  "flag": True},
]

DOCUMENTS = [
    {"id": 1,  "name": "BRSR Annual Report FY25-26.pdf",        "type": "Report",      "version": "v3", "date": "2026-09-18"},
    {"id": 2,  "name": "CBAM Declaration Q3 2026.xml",          "type": "Declaration", "version": "v1", "date": "2026-09-17"},
    {"id": 3,  "name": "Electricity Bill — August 2026.pdf",    "type": "Evidence",    "version": "v1", "date": "2026-09-05"},
    {"id": 4,  "name": "ISO 14001 Certificate.pdf",             "type": "Certificate", "version": "v2", "date": "2026-06-12"},
    {"id": 5,  "name": "Supplier Audit — Terai Alloys.pdf",     "type": "Evidence",    "version": "v1", "date": "2026-08-22"},
    {"id": 6,  "name": "CBAM Declaration Q2 2026.xml",          "type": "Declaration", "version": "v2", "date": "2026-06-30"},
    {"id": 7,  "name": "Water Audit Report FY25-26.pdf",        "type": "Report",      "version": "v1", "date": "2026-08-30"},
    {"id": 8,  "name": "Hazardous Waste Manifest — Aug.pdf",    "type": "Evidence",    "version": "v1", "date": "2026-09-02"},
    {"id": 9,  "name": "Grievance Redressal Policy.pdf",        "type": "Certificate", "version": "v4", "date": "2026-05-20"},
    {"id": 10, "name": "Electricity Bill — July 2026.pdf",      "type": "Evidence",    "version": "v1", "date": "2026-08-04"},
    {"id": 11, "name": "Supplier Audit — Dooars Coal.pdf",      "type": "Evidence",    "version": "v2", "date": "2026-07-15"},
    {"id": 12, "name": "CBAM Declaration Q1 2026.xml",          "type": "Declaration", "version": "v1", "date": "2026-04-30"},
]

# In-memory stores the demo API mutates so writes feel persistent in demo mode.
_suppliers_state = list(SUPPLIERS)
_documents_state = list(DOCUMENTS)
_activity_state = list(ACTIVITY_FEED)
_data_source_state = list(DATA_SOURCES)
_brsr_status = "draft"
_cbam_statuses = {s["id"]: s["status"] for s in CBAM_SHIPMENTS}


def next_supplier_id() -> int:
    return max((s["id"] for s in _suppliers_state), default=0) + 1


def next_document_id() -> int:
    return max((d["id"] for d in _documents_state), default=0) + 1


def log_activity(text: str) -> None:
    """Prepend a live activity entry (demo mode only)."""
    _activity_state.insert(0, {"id": f"a{len(_activity_state) + 1}", "text": text, "created_at": _ago(minutes=0, seconds=5)})


def bump_completeness(category: str, amount: int) -> None:
    for s in _data_source_state:
        if s["id"] == category:
            s["completeness"] = min(100, s["completeness"] + amount)
            s["lastUpdated"] = datetime.now(timezone.utc).date().isoformat()
