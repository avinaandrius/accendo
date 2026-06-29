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

alter table public.feedback enable row level security;

create policy "Users can create feedback" on public.feedback
  for insert with check (auth.uid() = user_id);

create policy "Users can view their feedback" on public.feedback
  for select using (auth.uid() = user_id);
