alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone_number text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();

create unique index if not exists profiles_phone_number_unique
  on public.profiles (phone_number)
  where phone_number is not null;

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
