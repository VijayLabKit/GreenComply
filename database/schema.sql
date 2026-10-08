-- GreenComply — Supabase (Postgres) schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Companies
-- ---------------------------------------------------------------------
create table if not exists companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  gstin         text,
  sector        text,
  location      text default 'Siliguri, West Bengal, India',
  export_status boolean default true,
  plan          text default 'Starter',
  employees     integer,
  turnover_cr   numeric,
  created_at    timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Users (simple role-based auth; passwords hashed with bcrypt in the API)
-- ---------------------------------------------------------------------
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid references companies(id) on delete cascade,
  email         text unique not null,
  password_hash text not null,
  role          text default 'Viewer' check (role in ('Admin', 'Editor', 'Viewer')),
  created_at    timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Data source entries (electricity, fuel, water, waste, raw material,
-- labor, transport — raw operational inputs)
-- ---------------------------------------------------------------------
create table if not exists data_entries (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid references companies(id) on delete cascade,
  category    text not null,          -- electricity | fuel | water | waste | raw_material | labor | transport
  facility    text,
  period      text,                   -- e.g. '2026-08'
  value       numeric,
  unit        text,
  created_at  timestamptz default now()
);

create table if not exists data_source_status (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid references companies(id) on delete cascade,
  category      text not null,
  completeness  integer default 0,
  last_updated  date,
  unique (company_id, category)
);

-- ---------------------------------------------------------------------
-- Emission records (computed from data_entries via emission factors)
-- ---------------------------------------------------------------------
create table if not exists emission_records (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid references companies(id) on delete cascade,
  facility      text,
  period        text,                 -- e.g. '2026-08'
  scope1        numeric default 0,
  scope2        numeric default 0,
  scope3        numeric default 0,
  co2e_tonnes   numeric generated always as (scope1 + scope2 + scope3) stored,
  created_at    timestamptz default now()
);

create table if not exists emission_factors (
  id      uuid primary key default gen_random_uuid(),
  source  text not null,
  factor  text not null
);

-- ---------------------------------------------------------------------
-- BRSR reports
-- ---------------------------------------------------------------------
create table if not exists brsr_reports (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid references companies(id) on delete cascade,
  status          text default 'draft',
  completeness    integer default 0,
  category_scores jsonb,
  principles      jsonb,
  generated_at    timestamptz default now(),
  unique (company_id)
);

-- ---------------------------------------------------------------------
-- CBAM declarations (one row per shipment)
-- ---------------------------------------------------------------------
create table if not exists cbam_declarations (
  id                  uuid primary key default gen_random_uuid(),
  company_id          uuid references companies(id) on delete cascade,
  shipment_ref        text,
  product             text,
  tonnes              numeric,
  emissions_per_tonne numeric,
  carbon_cost         numeric,
  status              text default 'Draft' check (status in ('Draft', 'Ready', 'Submitted', 'Overdue')),
  created_at          timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Suppliers
-- ---------------------------------------------------------------------
create table if not exists suppliers (
  id                    uuid primary key default gen_random_uuid(),
  company_id            uuid references companies(id) on delete cascade,
  name                  text not null,
  material              text,
  distance_km           numeric default 0,
  sustainability_score  integer default 50,
  flag                  boolean default false,
  created_at            timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Documents / compliance vault (metadata; binaries live in Supabase Storage)
-- ---------------------------------------------------------------------
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid references companies(id) on delete cascade,
  name        text not null,
  type        text default 'Evidence' check (type in ('Report', 'Declaration', 'Evidence', 'Certificate')),
  version     text default 'v1',
  storage_path text,
  date        date default current_date
);

-- ---------------------------------------------------------------------
-- Dashboard aggregates (denormalized for fast reads; refreshed by a job
-- or recomputed on write — kept simple for the demo)
-- ---------------------------------------------------------------------
create table if not exists dashboard_kpis (
  company_id            uuid primary key references companies(id) on delete cascade,
  compliance_score      integer default 0,
  total_emissions       numeric default 0,
  emissions_trend_pct   numeric default 0,
  reports_due           integer default 0,
  next_deadline         text,
  risk_flags            integer default 0
);

create table if not exists deadlines (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid references companies(id) on delete cascade,
  label       text not null,
  date        date not null,
  days_left   integer
);

create table if not exists activity_log (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid references companies(id) on delete cascade,
  text        text not null,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Row Level Security — enable and scope every table to the caller's company.
-- The FastAPI backend uses the Supabase service-role key, which bypasses
-- RLS; policies below protect direct client access (e.g. via the anon key).
-- ---------------------------------------------------------------------
alter table companies enable row level security;
alter table users enable row level security;
alter table data_entries enable row level security;
alter table data_source_status enable row level security;
alter table emission_records enable row level security;
alter table emission_factors enable row level security;
alter table brsr_reports enable row level security;
alter table cbam_declarations enable row level security;
alter table suppliers enable row level security;
alter table documents enable row level security;
alter table dashboard_kpis enable row level security;
alter table deadlines enable row level security;
alter table activity_log enable row level security;

create policy "company member read" on companies for select using (
  id in (select company_id from users where users.id = auth.uid())
);
