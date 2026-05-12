-- ============================================================
-- Triskope CRM — Phase A database schema
-- ============================================================
-- Paste this entire file into the Supabase SQL Editor:
--   Project → SQL Editor → New query → paste → Run
--
-- Idempotent: safe to re-run. Uses CREATE ... IF NOT EXISTS
-- and CREATE OR REPLACE wherever possible. Drop and re-run if
-- you want a clean slate (see "RESET" section at the bottom,
-- commented out for safety).
-- ============================================================


-- ------------------------------------------------------------
-- 0. Extensions
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()


-- ============================================================
-- 1. PROFILES — 1:1 with auth.users
-- ============================================================
-- Every authenticated user gets a profile row. Role drives
-- whether they see the admin panel or just their own data.
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  role         text not null default 'agent' check (role in ('admin','agent','visitor')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- 2. AGENTS — subscriber agents (paid customers)
-- ============================================================
-- An agent may exist without a linked profile_id (pre-seeded
-- demo agent). When a real user signs up, an admin can link
-- their profile_id to an existing agent slot or create a new one.
create table if not exists public.agents (
  id                     uuid primary key default gen_random_uuid(),
  profile_id             uuid unique references public.profiles(id) on delete set null,
  full_name              text not null,
  subdomain              text unique,                -- sarahmitchell
  plan                   text not null default 'starter' check (plan in ('starter','pro','enterprise')),
  access_status          text not null default 'active' check (access_status in ('active','past_due','suspended','canceled')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  headshot_url           text,
  bio                    text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists agents_profile_idx on public.agents(profile_id);
create index if not exists agents_plan_idx    on public.agents(plan);
create index if not exists agents_status_idx  on public.agents(access_status);


-- ============================================================
-- 3. LEADS
-- ============================================================
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  agent_id    uuid references public.agents(id) on delete set null,
  name        text not null,
  email       text,
  phone       text,
  source      text,
  status      text not null default 'new' check (status in ('new','nurture','hot','cold','closed')),
  stage       text not null default 'new' check (stage in ('new','contacted','qualified','showing','offer','closed')),
  score       int  not null default 0 check (score between 0 and 100),
  area        text,
  budget      text,
  interest    text,
  ai_notes    text,
  utm_source  text,
  utm_medium  text,
  utm_campaign text,
  added_days  int not null default 0,
  last_contact text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists leads_agent_idx  on public.leads(agent_id);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_stage_idx  on public.leads(stage);
create index if not exists leads_score_idx  on public.leads(score desc);


-- ============================================================
-- 4. LEAD_TAGS, LEAD_ACTIVITY, LEAD_NOTES, LEAD_TASKS
-- ============================================================
create table if not exists public.lead_tags (
  lead_id uuid not null references public.leads(id) on delete cascade,
  tag     text not null,
  primary key (lead_id, tag)
);

create table if not exists public.lead_activity (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  type        text not null,   -- view | email | call | form | showing | system
  text        text not null,
  icon        text,             -- maps to lucide icon in UI
  occurred_at timestamptz not null default now()
);
create index if not exists lead_activity_lead_idx on public.lead_activity(lead_id, occurred_at desc);

create table if not exists public.lead_notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  agent_id   uuid references public.agents(id) on delete set null,
  text       text not null,
  created_at timestamptz not null default now()
);
create index if not exists lead_notes_lead_idx on public.lead_notes(lead_id, created_at desc);

create table if not exists public.lead_tasks (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  agent_id   uuid references public.agents(id) on delete set null,
  text       text not null,
  due_date   date,
  done       boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists lead_tasks_lead_idx on public.lead_tasks(lead_id);
create index if not exists lead_tasks_due_idx  on public.lead_tasks(due_date) where not done;


-- ============================================================
-- 5. COMMUNITIES + per-agent COMMUNITY_PAGES
-- ============================================================
create table if not exists public.communities (
  id        uuid primary key default gen_random_uuid(),
  slug      text not null unique,
  name      text not null,
  area      text,
  type      text,
  icon      text,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_communities (
  agent_id     uuid not null references public.agents(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  primary key (agent_id, community_id)
);

create table if not exists public.community_pages (
  id           uuid primary key default gen_random_uuid(),
  agent_id     uuid not null references public.agents(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  custom_content jsonb default '{}'::jsonb,
  views        int not null default 0,
  leads_count  int not null default 0,
  unique (agent_id, community_id)
);


-- ============================================================
-- 6. LISTINGS + saved_listings
-- ============================================================
create table if not exists public.listings (
  id            uuid primary key default gen_random_uuid(),
  mls_id        text unique,
  address       text not null,
  community_id  uuid references public.communities(id) on delete set null,
  area          text,
  price         numeric not null,
  beds          numeric not null,
  baths         numeric not null,
  sqft          int    not null,
  type          text   not null check (type in ('Single Family','Condo','Townhouse','Land','Multi-Family')),
  status        text   not null default 'active' check (status in ('active','pending','sold','withdrawn')),
  lat           numeric,
  lng           numeric,
  listing_agent uuid references public.agents(id) on delete set null,
  days_on_market int not null default 0,
  photo         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists listings_community_idx on public.listings(community_id);
create index if not exists listings_status_idx    on public.listings(status);
create index if not exists listings_price_idx     on public.listings(price);

create table if not exists public.saved_listings (
  agent_id   uuid not null references public.agents(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  saved_at   timestamptz not null default now(),
  primary key (agent_id, listing_id)
);


-- ============================================================
-- 7. SUBSCRIPTIONS — mirror of Stripe state
-- ============================================================
create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  agent_id               uuid not null unique references public.agents(id) on delete cascade,
  stripe_subscription_id text unique,
  plan                   text not null check (plan in ('starter','pro','enterprise')),
  status                 text not null,             -- mirrors Stripe statuses
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);


-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  type      text not null,    -- new-lead | hot-alert | task-due | ai-suggest | showing | system
  title     text not null,
  body      text,
  lead_id   uuid references public.leads(id) on delete set null,
  link      text,
  read_at   timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);
create index if not exists notifications_unread_idx on public.notifications(user_id) where read_at is null;


-- ============================================================
-- 9. AUDIT_LOG — admin actions
-- ============================================================
create table if not exists public.audit_log (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action        text not null,
  target_table  text,
  target_id     uuid,
  payload       jsonb default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists audit_log_target_idx on public.audit_log(target_table, target_id);


-- ============================================================
-- 10. updated_at TRIGGER (applied to every table that has it)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in
    select unnest(array['profiles','agents','leads','lead_tasks','listings','subscriptions'])
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end$$;


-- ============================================================
-- 11. is_admin() helper for RLS policies
-- ============================================================
create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.current_agent_id()
returns uuid language sql stable security definer as $$
  select id from public.agents where profile_id = auth.uid();
$$;


-- ============================================================
-- 12. SEED DATA — 5 agents, 12 leads, 6 communities, 20 listings,
--                 10 notifications (admin-targeted)
-- ============================================================
-- Inserted before RLS is enabled. Uses ON CONFLICT DO NOTHING
-- so the file remains safe to re-run.

-- ---- Agents (no profile_id yet — claimable by admin) -------
insert into public.agents (id, full_name, subdomain, plan, access_status) values
  ('11111111-1111-1111-1111-000000000001'::uuid, 'Sarah Mitchell',  'sarahmitchell',  'pro',        'active'),
  ('11111111-1111-1111-1111-000000000002'::uuid, 'James Parker',    'jamesparker',    'enterprise', 'active'),
  ('11111111-1111-1111-1111-000000000003'::uuid, 'Lisa Chen',       'lisachen',       'starter',    'active'),
  ('11111111-1111-1111-1111-000000000004'::uuid, 'Marcus Johnson',  'marcusjohnson',  'pro',        'active'),
  ('11111111-1111-1111-1111-000000000005'::uuid, 'Amy Rodriguez',   'amyrodriguez',   'pro',        'active')
on conflict (id) do nothing;

-- ---- Communities -------------------------------------------
insert into public.communities (id, slug, name, area, type, icon) values
  ('22222222-2222-2222-2222-000000000001'::uuid, 'barefoot-resort','Barefoot Resort & Golf', 'North Myrtle Beach', 'Golf',   '⛳'),
  ('22222222-2222-2222-2222-000000000002'::uuid, 'grande-dunes',   'Grande Dunes',           'Myrtle Beach',       'Luxury', '🏖️'),
  ('22222222-2222-2222-2222-000000000003'::uuid, 'carolina-forest','Carolina Forest',        'Myrtle Beach',       'Family', '🌲'),
  ('22222222-2222-2222-2222-000000000004'::uuid, 'market-common',  'The Market Common',      'Myrtle Beach',       'Urban',  '🏙️'),
  ('22222222-2222-2222-2222-000000000005'::uuid, 'litchfield-beach','Litchfield Beach',      'Pawleys Island',     'Beach',  '🏝️'),
  ('22222222-2222-2222-2222-000000000006'::uuid, 'prince-creek',   'Prince Creek',           'Murrells Inlet',     'Family', '🏡')
on conflict (id) do nothing;

-- ---- Agent ↔ community subscriptions ----------------------
insert into public.agent_communities (agent_id, community_id) values
  ('11111111-1111-1111-1111-000000000001'::uuid,'22222222-2222-2222-2222-000000000002'::uuid),
  ('11111111-1111-1111-1111-000000000001'::uuid,'22222222-2222-2222-2222-000000000005'::uuid),
  ('11111111-1111-1111-1111-000000000002'::uuid,'22222222-2222-2222-2222-000000000001'::uuid),
  ('11111111-1111-1111-1111-000000000002'::uuid,'22222222-2222-2222-2222-000000000006'::uuid),
  ('11111111-1111-1111-1111-000000000003'::uuid,'22222222-2222-2222-2222-000000000004'::uuid),
  ('11111111-1111-1111-1111-000000000004'::uuid,'22222222-2222-2222-2222-000000000003'::uuid),
  ('11111111-1111-1111-1111-000000000005'::uuid,'22222222-2222-2222-2222-000000000006'::uuid)
on conflict do nothing;

-- ---- Leads (12, matching prototype) ------------------------
insert into public.leads
  (id, agent_id, name, email, phone, source, status, stage, score, area, budget, interest, ai_notes, added_days, last_contact)
values
  ('33333333-3333-3333-3333-000000000001'::uuid,'11111111-1111-1111-1111-000000000001'::uuid,'Robert Williams','rwilliams@gmail.com','(843) 555-0142','Market Report — Myrtle Beach','hot','qualified',94,'Myrtle Beach','$350K-$450K','Buying','High-intent buyer relocating from Charlotte. Viewed Myrtle Beach market report 4x this week. Pre-approved $475K.',12,'2h ago'),
  ('33333333-3333-3333-3333-000000000002'::uuid,'11111111-1111-1111-1111-000000000002'::uuid,'Jennifer Adams','jadams.nyc@outlook.com','(843) 555-0287','Community Page — Barefoot Resort','hot','contacted',88,'North Myrtle Beach','$500K-$700K','Buying','Relocating from Manhattan. Husband plays golf 4x/week.',8,'yesterday'),
  ('33333333-3333-3333-3333-000000000003'::uuid,'11111111-1111-1111-1111-000000000003'::uuid,'David Thompson','dthompson74@yahoo.com','(843) 555-0319','Agent Website','nurture','qualified',62,'Surfside Beach','Listing ~$320K','Selling','Considering selling in 3-6 months.',21,'5 days ago'),
  ('33333333-3333-3333-3333-000000000004'::uuid,'11111111-1111-1111-1111-000000000004'::uuid,'Maria Garcia','maria.garcia.sc@gmail.com','(843) 555-0451','Market Report — Conway','nurture','contacted',55,'Conway','$200K-$300K','Buying','First-time buyer. No pre-approval yet.',18,'1 week ago'),
  ('33333333-3333-3333-3333-000000000005'::uuid,'11111111-1111-1111-1111-000000000001'::uuid,'Karen Lee','kmlee.coastal@gmail.com','(843) 555-0598','Market Report — Pawleys Island','hot','offer',91,'Pawleys Island','$400K-$550K','Buying','Pre-approved $575K. Toured 142 Springs Ave Saturday.',6,'30 min ago'),
  ('33333333-3333-3333-3333-000000000006'::uuid,null,'Steve Chen','stevechen.work@gmail.com','(843) 555-0673','Agent Website','new','new',45,'Murrells Inlet','$250K-$350K','Buying','Just signed up. AI auto-qualifying.',1,'—'),
  ('33333333-3333-3333-3333-000000000007'::uuid,null,'Patricia Moore','p.moore.family@outlook.com','(843) 555-0712','Community Page — Carolina Forest','new','new',52,'Carolina Forest','$300K-$400K','Buying','Family of four relocating from Raleigh.',2,'—'),
  ('33333333-3333-3333-3333-000000000008'::uuid,'11111111-1111-1111-1111-000000000005'::uuid,'Tom Baker','tbaker.investments@protonmail.com','(843) 555-0884','Community Page — Grande Dunes','cold','contacted',28,'Myrtle Beach','$600K+','Investing','Investor based in Cleveland. Engagement dropped.',64,'3 weeks ago'),
  ('33333333-3333-3333-3333-000000000009'::uuid,'11111111-1111-1111-1111-000000000002'::uuid,'Daniel & Rachel Foster','fosters.move@gmail.com','(843) 555-0921','Market Report — North Myrtle Beach','hot','showing',86,'North Myrtle Beach','$650K-$850K','Buying','Tech couple from Austin. 30-day timeline.',4,'today'),
  ('33333333-3333-3333-3333-00000000000A'::uuid,'11111111-1111-1111-1111-000000000001'::uuid,'Linda Wexler','lwex55@yahoo.com','(843) 555-0987','Community Page — Litchfield Beach','nurture','contacted',68,'Pawleys Island','$450K-$600K','Buying','Second-home buyer, visit planned in 6 weeks.',32,'6 days ago'),
  ('33333333-3333-3333-3333-00000000000B'::uuid,'11111111-1111-1111-1111-000000000004'::uuid,'Marcus & Tonya Reed','reed.family5@gmail.com','(843) 555-1042','Agent Website','nurture','qualified',71,'Carolina Forest','$280K-$340K','Buying','Local family. Pre-approval in progress.',14,'4 days ago'),
  ('33333333-3333-3333-3333-00000000000C'::uuid,null,'Anthony Russo','arusso.philly@gmail.com','(843) 555-1158','Community Page — Market Common','new','new',58,'Myrtle Beach','$375K-$475K','Buying','Just relocated for new job. First-time buyer.',3,'—')
on conflict (id) do nothing;

-- ---- Lead tags ---------------------------------------------
insert into public.lead_tags (lead_id, tag) values
  ('33333333-3333-3333-3333-000000000001'::uuid,'pre-approved'),
  ('33333333-3333-3333-3333-000000000001'::uuid,'out-of-state'),
  ('33333333-3333-3333-3333-000000000001'::uuid,'oceanfront'),
  ('33333333-3333-3333-3333-000000000002'::uuid,'relocating'),
  ('33333333-3333-3333-3333-000000000002'::uuid,'golf'),
  ('33333333-3333-3333-3333-000000000002'::uuid,'luxury'),
  ('33333333-3333-3333-3333-000000000003'::uuid,'seller'),
  ('33333333-3333-3333-3333-000000000003'::uuid,'timeline-3-6mo'),
  ('33333333-3333-3333-3333-000000000004'::uuid,'first-time'),
  ('33333333-3333-3333-3333-000000000004'::uuid,'needs-preapproval'),
  ('33333333-3333-3333-3333-000000000005'::uuid,'pre-approved'),
  ('33333333-3333-3333-3333-000000000005'::uuid,'waterfront'),
  ('33333333-3333-3333-3333-000000000005'::uuid,'ready-to-offer'),
  ('33333333-3333-3333-3333-000000000006'::uuid,'new-lead'),
  ('33333333-3333-3333-3333-000000000006'::uuid,'auto-qualifying'),
  ('33333333-3333-3333-3333-000000000007'::uuid,'family'),
  ('33333333-3333-3333-3333-000000000007'::uuid,'schools'),
  ('33333333-3333-3333-3333-000000000007'::uuid,'new-lead'),
  ('33333333-3333-3333-3333-000000000008'::uuid,'investor'),
  ('33333333-3333-3333-3333-000000000008'::uuid,'low-engagement'),
  ('33333333-3333-3333-3333-000000000009'::uuid,'dual-income'),
  ('33333333-3333-3333-3333-000000000009'::uuid,'pre-approved'),
  ('33333333-3333-3333-3333-000000000009'::uuid,'urgent'),
  ('33333333-3333-3333-3333-00000000000A'::uuid,'second-home'),
  ('33333333-3333-3333-3333-00000000000A'::uuid,'boomer'),
  ('33333333-3333-3333-3333-00000000000B'::uuid,'growing-family'),
  ('33333333-3333-3333-3333-00000000000B'::uuid,'needs-4br'),
  ('33333333-3333-3333-3333-00000000000C'::uuid,'walkable'),
  ('33333333-3333-3333-3333-00000000000C'::uuid,'new-lead')
on conflict do nothing;

-- ---- Lead activity (sample for hot leads) ------------------
insert into public.lead_activity (lead_id, type, text, icon, occurred_at) values
  ('33333333-3333-3333-3333-000000000001'::uuid,'view','Viewed 1247 Ocean Blvd #802','Eye',           now() - interval '2 hours'),
  ('33333333-3333-3333-3333-000000000001'::uuid,'view','Re-opened Myrtle Beach market report','FileText', now() - interval '5 hours'),
  ('33333333-3333-3333-3333-000000000001'::uuid,'email','Opened drip email "Spring buyers guide"','Mail', now() - interval '1 day'),
  ('33333333-3333-3333-3333-000000000001'::uuid,'call','Sarah called — 8 min conversation','Phone',     now() - interval '3 days'),
  ('33333333-3333-3333-3333-000000000005'::uuid,'call','Sarah called — discussing offer terms','Phone', now() - interval '30 minutes'),
  ('33333333-3333-3333-3333-000000000005'::uuid,'view','Re-viewed 142 Springs Ave','Eye',              now() - interval '8 hours'),
  ('33333333-3333-3333-3333-000000000005'::uuid,'showing','In-person showing — 142 Springs Ave','MapPin', now() - interval '3 days'),
  ('33333333-3333-3333-3333-000000000009'::uuid,'showing','Toured 3 homes in NMB with James','MapPin', now() - interval '4 hours'),
  ('33333333-3333-3333-3333-000000000009'::uuid,'view','Re-viewed NMB market report','FileText',       now() - interval '1 day'),
  ('33333333-3333-3333-3333-000000000002'::uuid,'view','Viewed Barefoot Resort homes','Eye',           now() - interval '1 day'),
  ('33333333-3333-3333-3333-000000000002'::uuid,'call','James called — 22 min discovery call','Phone', now() - interval '2 days')
on conflict do nothing;

-- ---- Listings ----------------------------------------------
insert into public.listings (address, community_id, area, price, beds, baths, sqft, type, status, lat, lng, listing_agent, days_on_market, photo) values
  ('1247 Ocean Blvd #802',       null,                                                  'Myrtle Beach',       485000,  3, 2,   1456,'Condo',         'active',  33.690,-78.880,'11111111-1111-1111-1111-000000000001'::uuid, 4, '🌊'),
  ('142 Springs Ave',            '22222222-2222-2222-2222-000000000005'::uuid,'Pawleys Island',     625000,  4, 3,   2890,'Single Family','active',  33.495,-79.080,'11111111-1111-1111-1111-000000000001'::uuid, 2, '🏡'),
  ('88 Magnolia Lake Ct',        '22222222-2222-2222-2222-000000000001'::uuid,'North Myrtle Beach', 545000,  4, 3,   2640,'Single Family','active',  33.815,-78.715,'11111111-1111-1111-1111-000000000002'::uuid, 9, '⛳'),
  ('415 Cypress Way',            '22222222-2222-2222-2222-000000000003'::uuid,'Myrtle Beach',       358000,  4, 2.5, 2180,'Single Family','active',  33.760,-78.910,'11111111-1111-1111-1111-000000000004'::uuid,14, '🌲'),
  ('9 Beach Bridge Rd',          '22222222-2222-2222-2222-000000000005'::uuid,'Pawleys Island',    1250000,  5, 4.5, 4120,'Single Family','active',  33.485,-79.085,'11111111-1111-1111-1111-000000000001'::uuid, 1, '🏖️'),
  ('2210 N Ocean Blvd #1402',    null,                                                  'Myrtle Beach',       339000,  2, 2,   1180,'Condo',         'pending', 33.730,-78.860,'11111111-1111-1111-1111-000000000001'::uuid,18, '🌅'),
  ('147 Grande Dunes Pkwy',      '22222222-2222-2222-2222-000000000002'::uuid,'Myrtle Beach',     1485000,  5, 4.5, 4680,'Single Family','active',  33.755,-78.835,'11111111-1111-1111-1111-000000000001'::uuid,22, '🏛️'),
  ('3 Sandhill Crane Dr',        '22222222-2222-2222-2222-000000000006'::uuid,'Murrells Inlet',     298000,  3, 2,   1820,'Single Family','active',  33.595,-79.005,'11111111-1111-1111-1111-000000000005'::uuid, 5, '🌾'),
  ('523 Howard Ave',             '22222222-2222-2222-2222-000000000004'::uuid,'Myrtle Beach',       425000,  3, 2.5, 1980,'Townhouse',     'active',  33.665,-78.910,'11111111-1111-1111-1111-000000000003'::uuid, 7, '🏘️'),
  ('118 Magnolia Trail',         '22222222-2222-2222-2222-000000000003'::uuid,'Myrtle Beach',       312000,  3, 2,   1640,'Single Family','active',  33.745,-78.945,'11111111-1111-1111-1111-000000000004'::uuid,11, '🌳'),
  ('44 Pelican Pointe Dr',       '22222222-2222-2222-2222-000000000001'::uuid,'North Myrtle Beach', 729000,  4, 4,   3210,'Single Family','active',  33.820,-78.710,'11111111-1111-1111-1111-000000000002'::uuid, 3, '⛳'),
  ('8 Inlet Cove Way',           '22222222-2222-2222-2222-000000000006'::uuid,'Murrells Inlet',     545000,  3, 3,   2240,'Single Family','active',  33.555,-79.030,'11111111-1111-1111-1111-000000000002'::uuid, 6, '⛵'),
  ('1024 N Ocean Blvd #506',     null,                                                  'North Myrtle Beach', 412000,  2, 2,   1320,'Condo',         'active',  33.810,-78.715,'11111111-1111-1111-1111-000000000002'::uuid,16, '🌊'),
  ('67 Litchfield Country Club', '22222222-2222-2222-2222-000000000005'::uuid,'Pawleys Island',     489000,  3, 2.5, 2080,'Single Family','active',  33.490,-79.090,'11111111-1111-1111-1111-000000000001'::uuid, 8, '⛳'),
  ('31 Willow Bend Ct',          '22222222-2222-2222-2222-000000000003'::uuid,'Conway',             268000,  3, 2,   1480,'Single Family','active',  33.835,-79.045,'11111111-1111-1111-1111-000000000004'::uuid,19, '🌳'),
  ('207 Surfwood Dr',            null,                                                  'Surfside Beach',     385000,  3, 2,   1720,'Single Family','active',  33.605,-78.965,'11111111-1111-1111-1111-000000000003'::uuid, 4, '🏖️'),
  ('92 Plantation Dr',           '22222222-2222-2222-2222-000000000006'::uuid,'Murrells Inlet',     358000,  4, 2.5, 2350,'Single Family','active',  33.585,-79.015,'11111111-1111-1111-1111-000000000005'::uuid,12, '🌾'),
  ('780 Grande Dunes Way #305',  '22222222-2222-2222-2222-000000000002'::uuid,'Myrtle Beach',       695000,  3, 3,   2120,'Condo',         'active',  33.760,-78.840,'11111111-1111-1111-1111-000000000001'::uuid, 2, '🏛️'),
  ('55 Boardwalk Drive',         '22222222-2222-2222-2222-000000000004'::uuid,'Myrtle Beach',       612000,  4, 3.5, 2840,'Single Family','active',  33.670,-78.915,'11111111-1111-1111-1111-000000000003'::uuid,25, '🏙️'),
  ('12 Heron Lake Way',          '22222222-2222-2222-2222-000000000003'::uuid,'Myrtle Beach',       412000,  4, 3,   2470,'Single Family','active',  33.770,-78.925,'11111111-1111-1111-1111-000000000004'::uuid, 8, '🦩')
on conflict do nothing;

-- ---- Subscriptions (mirror demo) ---------------------------
insert into public.subscriptions (agent_id, plan, status, current_period_end) values
  ('11111111-1111-1111-1111-000000000001'::uuid,'pro',       'active', now() + interval '20 days'),
  ('11111111-1111-1111-1111-000000000002'::uuid,'enterprise','active', now() + interval '12 days'),
  ('11111111-1111-1111-1111-000000000003'::uuid,'starter',   'active', now() + interval '4 days'),
  ('11111111-1111-1111-1111-000000000004'::uuid,'pro',       'active', now() + interval '18 days'),
  ('11111111-1111-1111-1111-000000000005'::uuid,'pro',       'active', now() + interval '25 days')
on conflict do nothing;


-- ============================================================
-- 13. ROW LEVEL SECURITY
-- ============================================================
-- Strategy:
--   • profiles     — each user reads/updates their own; admins see all
--   • agents       — admins see all; agents see their own row only
--   • leads + child tables — admins see all; agents see leads where
--                            agent_id = current_agent_id()
--   • listings, communities — public read for authenticated users
--   • subscriptions, audit_log — admins only
--   • notifications — recipient or admin
-- ============================================================

alter table public.profiles          enable row level security;
alter table public.agents            enable row level security;
alter table public.leads             enable row level security;
alter table public.lead_tags         enable row level security;
alter table public.lead_activity     enable row level security;
alter table public.lead_notes        enable row level security;
alter table public.lead_tasks        enable row level security;
alter table public.communities       enable row level security;
alter table public.agent_communities enable row level security;
alter table public.community_pages   enable row level security;
alter table public.listings          enable row level security;
alter table public.saved_listings    enable row level security;
alter table public.subscriptions     enable row level security;
alter table public.notifications     enable row level security;
alter table public.audit_log         enable row level security;

-- Drop existing policies if re-running
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end$$;

-- profiles -------------------------------------------------
create policy "profiles_self_read"   on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles_self_update" on public.profiles for update using (id = auth.uid() or public.is_admin());

-- agents ---------------------------------------------------
create policy "agents_read_own_or_admin" on public.agents for select using (profile_id = auth.uid() or public.is_admin());
create policy "agents_admin_write"       on public.agents for all    using (public.is_admin()) with check (public.is_admin());
create policy "agents_self_update"       on public.agents for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- leads ----------------------------------------------------
create policy "leads_select" on public.leads for select using (agent_id = public.current_agent_id() or public.is_admin());
create policy "leads_modify" on public.leads for all    using (agent_id = public.current_agent_id() or public.is_admin())
                                                        with check (agent_id = public.current_agent_id() or public.is_admin());

-- child tables (lead_tags, lead_activity, lead_notes, lead_tasks)
create policy "lead_tags_access" on public.lead_tags for all using (
  exists (select 1 from public.leads l where l.id = lead_id and (l.agent_id = public.current_agent_id() or public.is_admin()))
) with check (
  exists (select 1 from public.leads l where l.id = lead_id and (l.agent_id = public.current_agent_id() or public.is_admin()))
);

create policy "lead_activity_access" on public.lead_activity for all using (
  exists (select 1 from public.leads l where l.id = lead_id and (l.agent_id = public.current_agent_id() or public.is_admin()))
) with check (
  exists (select 1 from public.leads l where l.id = lead_id and (l.agent_id = public.current_agent_id() or public.is_admin()))
);

create policy "lead_notes_access" on public.lead_notes for all using (
  exists (select 1 from public.leads l where l.id = lead_id and (l.agent_id = public.current_agent_id() or public.is_admin()))
) with check (
  exists (select 1 from public.leads l where l.id = lead_id and (l.agent_id = public.current_agent_id() or public.is_admin()))
);

create policy "lead_tasks_access" on public.lead_tasks for all using (
  exists (select 1 from public.leads l where l.id = lead_id and (l.agent_id = public.current_agent_id() or public.is_admin()))
) with check (
  exists (select 1 from public.leads l where l.id = lead_id and (l.agent_id = public.current_agent_id() or public.is_admin()))
);

-- communities / listings — read by any authenticated user; write admin only
create policy "communities_read"        on public.communities       for select using (auth.uid() is not null);
create policy "communities_admin_write" on public.communities       for all    using (public.is_admin()) with check (public.is_admin());

create policy "agent_communities_read"   on public.agent_communities for select using (agent_id = public.current_agent_id() or public.is_admin());
create policy "agent_communities_modify" on public.agent_communities for all    using (agent_id = public.current_agent_id() or public.is_admin())
                                                                     with check (agent_id = public.current_agent_id() or public.is_admin());

create policy "community_pages_access" on public.community_pages for all using (agent_id = public.current_agent_id() or public.is_admin())
                                                                 with check (agent_id = public.current_agent_id() or public.is_admin());

create policy "listings_read"        on public.listings for select using (auth.uid() is not null);
create policy "listings_admin_write" on public.listings for all    using (public.is_admin()) with check (public.is_admin());

create policy "saved_listings_access" on public.saved_listings for all using (agent_id = public.current_agent_id() or public.is_admin())
                                                              with check (agent_id = public.current_agent_id() or public.is_admin());

-- subscriptions — agent reads own; admin all
create policy "subscriptions_read"  on public.subscriptions for select using (agent_id = public.current_agent_id() or public.is_admin());
create policy "subscriptions_admin" on public.subscriptions for all    using (public.is_admin()) with check (public.is_admin());

-- notifications — recipient or admin
create policy "notifications_read"   on public.notifications for select using (user_id = auth.uid() or public.is_admin());
create policy "notifications_update" on public.notifications for update using (user_id = auth.uid() or public.is_admin())
                                                             with check  (user_id = auth.uid() or public.is_admin());
create policy "notifications_admin"  on public.notifications for all    using (public.is_admin()) with check (public.is_admin());

-- audit_log — admin only
create policy "audit_log_admin" on public.audit_log for all using (public.is_admin()) with check (public.is_admin());


-- ============================================================
-- 14. POST-INSTALL NOTES
-- ============================================================
-- 1. Create yourself an admin user:
--      a. Supabase Dashboard → Authentication → Users → "Add user" → create with your email + password.
--      b. After signup, run this in the SQL Editor:
--         update public.profiles set role='admin' where email = 'YOUR_EMAIL_HERE';
--      c. Re-login; you'll now be treated as admin by all RLS policies.
--
-- 2. To "claim" a seeded demo agent as your own (for development):
--      update public.agents set profile_id = auth.uid() where subdomain = 'sarahmitchell';
--    (Run this while logged in as the user you want to assign.)
--
-- 3. To verify policies work, switch to "anon" role in SQL Editor (right side)
--    and try: select * from public.leads;  → should return 0 rows.
--    Then switch back to "authenticated" with your admin user → should return 12.


-- ============================================================
-- RESET (uncomment to wipe everything and start over)
-- ============================================================
-- drop table if exists public.audit_log         cascade;
-- drop table if exists public.notifications     cascade;
-- drop table if exists public.subscriptions     cascade;
-- drop table if exists public.saved_listings    cascade;
-- drop table if exists public.listings          cascade;
-- drop table if exists public.community_pages   cascade;
-- drop table if exists public.agent_communities cascade;
-- drop table if exists public.communities       cascade;
-- drop table if exists public.lead_tasks        cascade;
-- drop table if exists public.lead_notes        cascade;
-- drop table if exists public.lead_activity     cascade;
-- drop table if exists public.lead_tags         cascade;
-- drop table if exists public.leads             cascade;
-- drop table if exists public.agents            cascade;
-- drop table if exists public.profiles          cascade;
-- drop function if exists public.is_admin()        cascade;
-- drop function if exists public.current_agent_id() cascade;
-- drop function if exists public.handle_new_user()  cascade;
-- drop function if exists public.set_updated_at()   cascade;
