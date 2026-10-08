# GreenComply

Sustainability compliance-as-a-service for MSMEs — auto-generates **BRSR**
(India/SEBI) and **CBAM** (EU) reports from operational data (electricity
bills, fuel use, production volume, waste logs, supplier data).

Demo dataset: a fictional exporter, **Himalayan Steel Works Pvt. Ltd.**
(Siliguri, West Bengal), fully seeded across 12 months.

```
frontend/    React + Vite + Tailwind CSS + Recharts
backend/     FastAPI (Python)
database/    Supabase (Postgres) schema
```

## Quick start (demo mode — no setup required)

The backend runs out of the box against realistic in-memory seed data, so
you can demo the full product without configuring Supabase first.

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # optional
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend** (separate terminal)
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Log in with any email/password — demo mode
accepts anything and signs you in as Himalayan Steel Works.

The frontend also has its own local fallback data (`src/data/mockData.js`),
so every page still renders fully even if the backend isn't running.

## Connecting a real Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run `database/schema.sql`.
3. Copy `backend/.env.example` to `backend/.env` and fill in:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-service-role-key   # Project Settings → API
   JWT_SECRET=<a long random string>
   ```
4. Seed the demo company (12 months of data, 8 suppliers, BRSR + CBAM
   records, documents):
   ```bash
   cd backend
   python -m app.seed
   ```
   This prints a demo login: `vijay@himalayansteel.example` /
   `greencomply-demo`.
5. Restart the backend — `GET /` will now report `"database": "supabase"`
   and every route reads/writes Postgres instead of the in-memory seed.
6. Point the frontend at Supabase directly for optional features (e.g.
   Storage) by copying `frontend/.env.example` to `frontend/.env` and
   filling in `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. The frontend
   always talks to the FastAPI backend for data — Supabase is used
   backend-side.

## API

Interactive docs at `http://localhost:8000/docs` once the backend is
running. Resource groups: `auth`, `company`, `data-sources`, `emissions`,
`reports` (BRSR + CBAM), `suppliers`, `dashboard`, `documents`.

## Deployment notes

- `backend/Dockerfile` builds a standalone container (`uvicorn` on port
  8000).
- `frontend` builds to static files via `npm run build` (output in
  `frontend/dist/`) — deployable to any static host, with `VITE_API_URL`
  pointed at your deployed backend.
- No external paid services are required to run the demo end-to-end.
