alter table public.profiles add column if not exists onboarded boolean not null default false;
alter table public.profiles add column if not exists total_questions integer not null default 0;
alter table public.profiles add column if not exists correct_answers integer not null default 0;
alter table public.profiles add column if not exists mistakes jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists daily_goal integer not null default 1;
alter table public.profiles add column if not exists lessons_today integer not null default 0;
alter table public.profiles add column if not exists last_study_date date;
alter table public.profiles add column if not exists lesson_attempts jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists app_settings jsonb not null default '{}'::jsonb;
