-- Run this in your Supabase SQL Editor

create table if not exists debates (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  rounds jsonb not null default '{}',
  consensus text,
  created_at timestamptz not null default now()
);

-- Index for fast date-ordered listing
create index if not exists debates_created_at_idx on debates (created_at desc);

-- Enable Row Level Security
alter table debates enable row level security;

-- Allow backend (service role) full access
-- Public read so the frontend history page works without auth
create policy "Public read" on debates
  for select using (true);

create policy "Service insert" on debates
  for insert with check (true);
