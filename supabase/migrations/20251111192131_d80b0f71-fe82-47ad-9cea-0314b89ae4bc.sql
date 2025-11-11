-- Create profiles table for user data
create table public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  favorite_pet text check (favorite_pet in ('dog', 'cat', 'bird')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Profiles are viewable by everyone
create policy "Profiles are viewable by everyone" 
on public.profiles 
for select 
using (true);

-- Users can update their own profile
create policy "Users can update their own profile" 
on public.profiles 
for update 
using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert their own profile" 
on public.profiles 
for insert 
with check (auth.uid() = id);

-- Create function to handle new user profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id, 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'display_name'
  );
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger to update updated_at on profile changes
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();