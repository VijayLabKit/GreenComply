from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS, SUPABASE_CONFIGURED
from app.routers import auth, company, data_sources, emissions, reports, suppliers, dashboard, documents

app = FastAPI(
    title="GreenComply API",
    description="Sustainability compliance-as-a-service backend for MSMEs (BRSR + CBAM).",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(company.router)
app.include_router(data_sources.router)
app.include_router(emissions.router)
app.include_router(reports.router)
app.include_router(suppliers.router)
app.include_router(dashboard.router)
app.include_router(documents.router)


@app.get("/")
def root():
    return {
        "service": "GreenComply API",
        "status": "ok",
        "database": "supabase" if SUPABASE_CONFIGURED else "demo (in-memory seed data)",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
