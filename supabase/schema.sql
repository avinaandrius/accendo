create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'SIE Candidate',
  username text unique,
  email text,
  xp integer not null default 0,
  streak integer not null default 0,
  daily_goal integer not null default 1,
  weekly_goal integer not null default 5,
  exam_date date,
  notifications boolean not null default true,
  public_profile boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists onboarded boolean not null default false;
alter table public.profiles add column if not exists total_questions integer not null default 0;
alter table public.profiles add column if not exists correct_answers integer not null default 0;
alter table public.profiles add column if not exists mistakes jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists daily_goal integer not null default 1;
alter table public.profiles add column if not exists lessons_today integer not null default 0;
alter table public.profiles add column if not exists last_study_date date;
alter table public.profiles add column if not exists lesson_attempts jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists app_settings jsonb not null default '{}'::jsonb;

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

create policy "Users can view their profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can create their profile" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users can update their profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can view their progress" on public.lesson_progress
  for select using (auth.uid() = user_id);
create policy "Users can create their progress" on public.lesson_progress
  for insert with check (auth.uid() = user_id);
create policy "Users can update their progress" on public.lesson_progress
  for update using (auth.uid() = user_id);

create policy "Users can create feedback" on public.feedback
  for insert with check (auth.uid() = user_id);
create policy "Users can view their feedback" on public.feedback
  for select using (auth.uid() = user_id);
