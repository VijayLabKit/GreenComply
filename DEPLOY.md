# GreenComply — Deployment Guide

Three services, deployed in order. Total time: ~20 minutes. No manual
debugging should be needed if each step is followed exactly.

| Service | What it hosts | Key env vars |
|---|---|---|
| Supabase | Postgres database (schema + seed) | `SUPABASE_URL`, `SUPABASE_KEY` |
| Render | FastAPI backend | `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`, `CORS_ORIGINS` |
| Vercel | React frontend (static SPA) | `VITE_API_URL` |

---

## 1) Supabase (database)

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Open **SQL Editor** → **New query**, paste the entire contents of
   [`database/schema.sql`](database/schema.sql), and click **Run**.
   - This creates 12 tables (companies, users, data_entries, emission_records,
     brsr_reports, cbam_declarations, suppliers, documents, dashboard_kpis,
     deadlines, activity_log, data_source_status) and enables Row Level
     Security on all of them.
   - **RLS and the backend:** the FastAPI backend must use the **service-role
     key** (`service_role` secret), which bypasses RLS entirely. The policies
     in `schema.sql` only restrict direct client access via the anon key, so
     they will *not* block backend inserts/reads.
3. Grab credentials from **Project Settings → API**:
   - `Project URL` → this is `SUPABASE_URL`
   - `service_role` secret → this is `SUPABASE_KEY`
   ⚠️ Use the service-role key, not the anon key, and never commit it.

### Seed the demo company

```bash
cd backend
cp .env.example .env          # then fill in the two Supabase values
pip install -r requirements.txt
python -m app.seed
```

This inserts "Himalayan Steel Works Pvt. Ltd." with 12 months of emissions,
14 suppliers (6 flagged, incl. one with zero data), 6 CBAM shipments (1
overdue), a BRSR report with partial principles, 12 documents and a staggered
activity feed. It prints the demo login:

```
email:    vijay@himalayansteel.example
password: greencomply-demo
```

Sanity check: `GET https://<your-api>/` (after step 2) should report
`"database": "supabase"`.

---

## 2) Render (FastAPI backend)

### Option A — Blueprint (recommended)

1. Push this repo to GitHub.
2. Render dashboard → **New → Blueprint** → select the repo. Render reads
   [`render.yaml`](render.yaml) and creates the service.
3. In the service's **Environment** tab, set the `sync: false` secrets:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_KEY` = your service_role secret
   - `CORS_ORIGINS` = your Vercel URL (step 3), e.g.
     `https://greencomply.vercel.app` (comma-separate multiple origins).
   `JWT_SECRET` is auto-generated. Save — the service redeploys.

### Option B — Manual dashboard settings

| Setting | Value |
|---|---|
| Runtime | Python 3 |
| Root directory | `backend` |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health check path | `/health` |

Add env vars: `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET` (long random
string), `JWT_EXPIRE_MINUTES=1440`, `CORS_ORIGINS=<your-vercel-url>`.

**Verify:** `curl https://<your-api>.onrender.com/health` → `{"status":"ok"}`.
Interactive API docs: `https://<your-api>.onrender.com/docs`.

> CORS note: `CORS_ORIGINS` is read from the environment only — nothing is
> hardcoded. Add your production Vercel origin here; localhost origins are
> already defaulted for local development.

---

## 3) Vercel (React frontend)

1. Vercel dashboard → **Add New → Project** → import the repo.
2. Configure:
   - **Root directory:** `frontend`
   - **Framework preset:** Vite (auto-detected)
   - **Build command:** `npm run build` · **Output:** `dist`
3. Environment variable (Production + Preview):
   - `VITE_API_URL` = `https://<your-api>.onrender.com` (no trailing slash)
4. Deploy. SPA routing to `/app/*`, `/login`, etc. is handled by
   [`frontend/vercel.json`](frontend/vercel.json), which rewrites all routes
   to `/index.html`.
5. **After deploy**, copy your final Vercel URL (e.g.
   `https://greencomply-xyz.vercel.app`) and add it to `CORS_ORIGINS` on
   Render, then redeploy the backend once. Done.

**Verify:** open the Vercel URL → log in with the demo credentials →
Dashboard shows live data from Supabase; BRSR "Export PDF report" downloads
a real PDF; CBAM "Export CSV" downloads a real CSV.

---

## Local development

```bash
# backend (demo mode, no Supabase needed)
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# frontend
cd frontend && npm install && npm run dev
```

Local env files (both gitignored): `backend/.env` and `frontend/.env` —
copy from the `.env.example` in each directory.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Dashboard shows yellow "demo data" banner | Frontend can't reach the API — check `VITE_API_URL` and that the Render service is awake (free tier sleeps after 15 min idle). |
| Login returns 401 on production | Supabase users table wasn't seeded — run `python -m app.seed`. |
| Browser console CORS errors | `CORS_ORIGINS` on Render doesn't include your Vercel URL. |
| `"database": "demo"` from `/` | `SUPABASE_URL`/`SUPABASE_KEY` not set on the backend service. |
| RLS "new row violates policy" in seed | You're using the anon key — seed and serve with the service-role key. |
