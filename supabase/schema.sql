-- ============================================================================
-- STRETCH CLIENT PORTAL — database schema (run once in Supabase: SQL Editor)
--
-- Design decisions:
--   • The pricebook holds ONLY client-safe columns. Margin % and the cost
--     build-up stay in the Alto Pricing System Excel and are never uploaded.
--   • Every client account is granted a set of price groups ("markets");
--     row-level security enforces visibility in the database itself, so even
--     an application bug cannot leak another market's pricing.
--   • All writes go through the service-role key (admin API routes / CLI
--     scripts). Signed-in users are read-only by construction: no INSERT /
--     UPDATE / DELETE policies exist.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Portal user profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.portal_users (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  company     text,
  role        text not null default 'client' check (role in ('client', 'admin')),
  -- Account tier: 'producer' = producer/reseller partner; 'installer' =
  -- trade account that buys & installs; 'b2c' = self-registered consumer
  -- (own area, NO trade pricing / designer); 'architect' = self-registered
  -- specifier (architect area, NEVER any trade pricing).
  account_type text not null default 'installer'
    check (account_type in ('producer', 'installer', 'b2c', 'architect')),
  -- Price groups this account may see (values match pricebook.market).
  markets     text[] not null default '{}',
  all_markets boolean not null default false,
  active      boolean not null default true,
  -- B2B qualification data collected at self-registration (admin reviews
  -- these before upgrading the account to a trade tier).
  contact_name  text,
  vat           text,
  phone         text,
  country       text,   -- ISO 3166-1 alpha-2, or 'OTHER'
  business_type text,   -- installer | distributor | architect | contractor | other
  created_at  timestamptz not null default now()
);

-- Existing databases (created before account tiers): run this once.
-- (NOTE: add column if not exists does NOT update an existing check — the
-- ARCHITECT AREA block at the bottom swaps the constraint for live DBs.)
alter table public.portal_users
  add column if not exists account_type text not null default 'installer'
  check (account_type in ('producer', 'installer', 'b2c', 'architect'));

-- Existing databases (created before the B2B signup fields, Aug 2026): run once.
alter table public.portal_users add column if not exists contact_name  text;
alter table public.portal_users add column if not exists vat           text;
alter table public.portal_users add column if not exists phone         text;
alter table public.portal_users add column if not exists country       text;
alter table public.portal_users add column if not exists business_type text;

-- ---------------------------------------------------------------------------
-- 2. Pricebook — flat product × market pricelist (mirrors the Excel PriceBook)
-- ---------------------------------------------------------------------------
create table if not exists public.pricebook (
  id            bigint generated always as identity primary key,
  -- Top-level product family from the workbook's Type column
  -- (e.g. 'PVC stretch ceilings', 'fabric stretch ceilings').
  type          text,
  category      text not null,
  code          text,
  product       text not null,
  unit          text,
  market        text not null,
  price_eur     numeric(12, 2) not null,
  price_pln     numeric(12, 2),
  product_group text,
  -- Occurrence number among rows sharing category+product+market: the Excel
  -- PriceBook legitimately contains same-named rows with different prices
  -- (e.g. roll width bands), and none may be dropped.
  seq           integer not null default 1,
  sort          integer not null default 0,
  updated_at    timestamptz not null default now(),
  unique (category, product, market, seq)
);

create index if not exists pricebook_market_idx on public.pricebook (market);
create index if not exists pricebook_sort_idx on public.pricebook (sort);

-- Existing databases (created before the Type column, Aug 2026): run this once,
-- then re-upload the workbook so the column gets populated.
alter table public.pricebook add column if not exists type text;

-- ---------------------------------------------------------------------------
-- 3. Pricelist metadata (single row: version, FX reference, source file)
-- ---------------------------------------------------------------------------
create table if not exists public.pricebook_meta (
  id         boolean primary key default true check (id), -- forces one row
  version    text,
  fx_eur_pln numeric(10, 4),
  source     text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. Row-level security
-- ---------------------------------------------------------------------------
alter table public.portal_users  enable row level security;
alter table public.pricebook     enable row level security;
alter table public.pricebook_meta enable row level security;

-- A user may read their own profile (needed at login / session resolution).
drop policy if exists portal_users_read_own on public.portal_users;
create policy portal_users_read_own
  on public.portal_users for select
  to authenticated
  using (id = auth.uid());

-- Pricebook: visible when the signed-in, ACTIVE profile is granted the row's
-- market (or all markets). Admins always see everything.
drop policy if exists pricebook_read_by_market on public.pricebook;
create policy pricebook_read_by_market
  on public.pricebook for select
  to authenticated
  using (
    exists (
      select 1
      from public.portal_users u
      where u.id = auth.uid()
        and u.active
        and (
          u.all_markets
          or u.role = 'admin'
          -- extra per-account grants
          or pricebook.market = any (u.markets)
          -- the account tier's own price group (tolerant of label spellings).
          -- Architects get NULL — never equal to any market, so an architect
          -- account can never read a single pricebook row.
          or pricebook.market = (case
               when u.account_type ilike '%architect%' then null
               when u.account_type ilike '%producer%' or u.account_type ilike '%reseller%' then 'Producer/Reseller'
               when lower(u.account_type) = 'b2c' then 'B2C'
               else 'Installer'
             end)
        )
    )
  );

-- Metadata: readable by any active portal account.
drop policy if exists pricebook_meta_read on public.pricebook_meta;
create policy pricebook_meta_read
  on public.pricebook_meta for select
  to authenticated
  using (
    exists (
      select 1 from public.portal_users u
      where u.id = auth.uid() and u.active
    )
  );

-- No write policies on purpose: only the service role (which bypasses RLS)
-- may write, and it is used exclusively by the admin API routes/CLI scripts.

-- ============================================================================
-- LEADS — every website enquiry (contact, quote modals, materials inquiry,
-- dealer pages) is stored here IN ADDITION to the e-mail delivery.
-- Added 7 Aug 2026. Safe to re-run (create if not exists).
-- ============================================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,
  name text,
  email text,
  phone text,
  company text,
  message text,
  product text,
  colour text,
  colour_code text,
  items text,
  page text,
  delivered boolean not null default false,
  delivery_method text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_source_idx on public.leads (source);

alter table public.leads enable row level security;
-- No policies on purpose: only the service role (server API route) can write,
-- and reading happens via the Supabase dashboard / future admin panel.

-- ============================================================================
-- CEILING DESIGNER — saved designs, orders and usage events.
-- Added 8 Aug 2026. Safe to re-run (create if not exists).
-- All access goes through the service-role key in the portal API routes,
-- which verify the caller's session first — hence RLS with no policies.
-- ============================================================================
create table if not exists public.designer_designs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.portal_users (id) on delete cascade,
  user_email text not null,
  name       text not null default 'Untitled',
  -- The designer's own measurement-file format (app:'abc-floorplan').
  state      jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists designer_designs_user_idx
  on public.designer_designs (user_email, updated_at desc);

create table if not exists public.designer_orders (
  id              uuid primary key default gen_random_uuid(),
  ref             text not null,
  user_id         uuid references public.portal_users (id) on delete set null,
  user_email      text not null,
  company         text,
  client          jsonb not null default '{}'::jsonb,
  product         jsonb not null default '{}'::jsonb,
  specification   jsonb not null default '{}'::jsonb,
  quote           jsonb not null default '{}'::jsonb,
  drawing         jsonb not null default '{}'::jsonb,
  status          text not null default 'received'
                  check (status in ('received','confirmed','in_production','delivered','cancelled')),
  delivered       boolean not null default false,
  delivery_method text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists designer_orders_user_idx
  on public.designer_orders (user_email, created_at desc);
create index if not exists designer_orders_ref_idx on public.designer_orders (ref);

create table if not exists public.designer_events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event      text not null,
  user_email text,
  demo       boolean not null default false,
  meta       jsonb not null default '{}'::jsonb
);
create index if not exists designer_events_created_idx
  on public.designer_events (created_at desc);

alter table public.designer_designs enable row level security;
alter table public.designer_orders  enable row level security;
alter table public.designer_events  enable row level security;
-- No policies on purpose: service-role only, via the authenticated API routes.

-- ---------------------------------------------------------------------------
-- Storage bucket for designer order documents (PDF/DXF). Private; the portal
-- API uploads via the service role and hands out 30-day signed URLs in the
-- order e-mails. Safe to re-run.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('designer-orders', 'designer-orders', false)
on conflict (id) do nothing;

-- Order document index (filenames + storage paths) on each order row.
alter table public.designer_orders
  add column if not exists files jsonb not null default '[]'::jsonb;

-- ---------------------------------------------------------------------------
-- ACCOUNT TIERS (2026-08): the b2b/b2c split became three tiers —
-- 'producer' (producer/reseller), 'installer' and 'b2c'. Run once on
-- existing databases; maps display labels and legacy 'b2b' to canonical
-- values. Safe to re-run.
-- ---------------------------------------------------------------------------
alter table public.portal_users
  drop constraint if exists portal_users_account_type_check;
update public.portal_users set account_type = case
  when account_type ilike '%producer%' or account_type ilike '%reseller%' then 'producer'
  when lower(account_type) = 'b2c' then 'b2c'
  else 'installer'
end
where account_type not in ('producer', 'installer', 'b2c');
alter table public.portal_users
  add constraint portal_users_account_type_check
  check (account_type in ('producer', 'installer', 'b2c'));
alter table public.portal_users
  alter column account_type set default 'installer';

-- PriceBook v2.4 renamed the price groups to the three account tiers
-- (Producer/Reseller · Installer · B2C); visibility now follows the tier
-- automatically. Re-create the read policy (same statement as above — run
-- this when upgrading an existing database), then clear stale per-account
-- grants that referenced the old group names:
update public.portal_users
  set markets = '{}'
  where not (markets <@ array['Producer/Reseller', 'Installer', 'B2C']);

-- ============================================================================
-- ARCHITECT AREA — the architect account tier + its profile fields.
-- Added 8 Aug 2026. Run manually in the Supabase SQL editor; safe to re-run.
-- ============================================================================

-- 1) Allow 'architect' in account_type. `add column if not exists` never
--    updates an existing check, so drop whatever check constrains the column
--    and recreate it with the four-value set.
do $$
declare c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'portal_users'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) like '%account_type%'
  loop
    execute format('alter table public.portal_users drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.portal_users
  add constraint portal_users_account_type_check
  check (account_type in ('producer', 'installer', 'b2c', 'architect'));

-- 2) Architect profile fields (office name + city from signup).
alter table public.portal_users add column if not exists office text;
alter table public.portal_users add column if not exists city   text;

-- 3) Refresh the pricebook read policy so architect accounts resolve to NO
--    price group (same text as section 4 above — repeated here so this block
--    is self-contained).
drop policy if exists pricebook_read_by_market on public.pricebook;
create policy pricebook_read_by_market
  on public.pricebook for select
  to authenticated
  using (
    exists (
      select 1
      from public.portal_users u
      where u.id = auth.uid()
        and u.active
        and (
          u.all_markets
          or u.role = 'admin'
          or pricebook.market = any (u.markets)
          or pricebook.market = (case
               when u.account_type ilike '%architect%' then null
               when u.account_type ilike '%producer%' or u.account_type ilike '%reseller%' then 'Producer/Reseller'
               when lower(u.account_type) = 'b2c' then 'B2C'
               else 'Installer'
             end)
        )
    )
  );
