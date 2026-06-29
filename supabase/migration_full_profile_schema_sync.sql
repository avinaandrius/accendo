-- Accendo full profile schema sync
-- Run this once in the Supabase SQL editor to align an existing database with the current React/Vite frontend.
-- This migration is additive and preserves existing data.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade
);

alter table public.profiles add column if not exists name text not null default 'SIE Candidate';
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone_number text;
alter table public.profiles add column if not exists xp integer not null default 0;
alter table public.profiles add column if not exists streak integer not null default 0;
alter table public.profiles add column if not exists daily_goal integer not null default 1;
alter table public.profiles add column if not exists weekly_goal integer not null default 5;
alter table public.profiles add column if not exists exam_date date;
alter table public.profiles add column if not exists onboarded boolean not null default false;
alter table public.profiles add column if not exists total_questions integer not null default 0;
alter table public.profiles add column if not exists correct_answers integer not null default 0;
alter table public.profiles add column if not exists mistakes jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists lessons_today integer not null default 0;
alter table public.profiles add column if not exists last_study_date date;
alter table public.profiles add column if not exists lesson_attempts jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists app_settings jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- Backfill newer fields from older profile data where possible.
update public.profiles
set full_name = coalesce(full_name, name)
where full_name is null;

-- Uniqueness expected by the frontend.
create unique index if not exists profiles_username_unique
  on public.profiles (username)
  where username is not null;

create unique index if not exists profiles_phone_number_unique
  on public.profiles (phone_number)
  where phone_number is not null;

-- Used by signup to check whether a phone number is already tied to an Accendo profile.
create or replace function public.is_phone_number_available(phone_number_to_check text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.profiles
    where phone_number = phone_number_to_check
  );
$$;

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  score integer,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  category text not null check (category in ('bug', 'confusing_lesson', 'feature_request', 'general_comment')),
  message text not null,
  context text,
  page text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.feedback enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can view their profile'
  ) then
    create policy "Users can view their profile" on public.profiles
      for select using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can create their profile'
  ) then
    create policy "Users can create their profile" on public.profiles
      for insert with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update their profile'
  ) then
    create policy "Users can update their profile" on public.profiles
      for update using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'lesson_progress' and policyname = 'Users can view their progress'
  ) then
    create policy "Users can view their progress" on public.lesson_progress
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'lesson_progress' and policyname = 'Users can create their progress'
  ) then
    create policy "Users can create their progress" on public.lesson_progress
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'lesson_progress' and policyname = 'Users can update their progress'
  ) then
    create policy "Users can update their progress" on public.lesson_progress
      for update using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'feedback' and policyname = 'Users can create feedback'
  ) then
    create policy "Users can create feedback" on public.feedback
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'feedback' and policyname = 'Users can view their feedback'
  ) then
    create policy "Users can view their feedback" on public.feedback
      for select using (auth.uid() = user_id);
  end if;
end $$;
