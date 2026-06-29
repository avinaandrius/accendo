-- Rollback for migration_full_profile_schema_sync.sql
-- Use only if you intentionally need to undo the schema-sync migration.
-- Warning: dropping columns removes the data stored in those columns.

drop function if exists public.is_phone_number_available(text);
drop index if exists public.profiles_phone_number_unique;
drop index if exists public.profiles_username_unique;

alter table public.profiles drop column if exists full_name;
alter table public.profiles drop column if exists phone_number;
alter table public.profiles drop column if exists xp;
alter table public.profiles drop column if exists streak;
alter table public.profiles drop column if exists daily_goal;
alter table public.profiles drop column if exists weekly_goal;
alter table public.profiles drop column if exists exam_date;
alter table public.profiles drop column if exists onboarded;
alter table public.profiles drop column if exists total_questions;
alter table public.profiles drop column if exists correct_answers;
alter table public.profiles drop column if exists mistakes;
alter table public.profiles drop column if exists lessons_today;
alter table public.profiles drop column if exists last_study_date;
alter table public.profiles drop column if exists lesson_attempts;
alter table public.profiles drop column if exists app_settings;
