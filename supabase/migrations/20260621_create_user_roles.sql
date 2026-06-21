-- Create user_roles table
create table public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Allow users to read their own role
create policy "Users can view their own role"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- Only allow inserts during signup (via trigger)
create policy "Only authenticated users can insert roles"
  on public.user_roles for insert
  with check (auth.uid() = user_id);

-- Create index
create index idx_user_roles_user_id on public.user_roles(user_id);

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_user_roles_updated_at
  before update on public.user_roles
  for each row
  execute function update_updated_at_column();
