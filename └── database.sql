-- ============================================
-- PERSONAL FILES MANAGER DATABASE
-- ============================================

-- Create table
create table if not exists public.user_files (

    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    display_name text not null,

    original_name text not null,

    storage_path text not null unique,

    mime_type text,

    file_size bigint default 0,

    file_type text not null
        check (file_type in ('photo', 'file')),

    created_at timestamptz
        not null
        default now()
);


-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

alter table public.user_files
enable row level security;


-- ============================================
-- DATABASE POLICIES
-- ============================================

-- User can view only their own files
create policy "Users can view their own files"

on public.user_files

for select

to authenticated

using (
    auth.uid() = user_id
);


-- User can insert only their own files
create policy "Users can insert their own files"

on public.user_files

for insert

to authenticated

with check (
    auth.uid() = user_id
);


-- User can rename only their own files
create policy "Users can update their own files"

on public.user_files

for update

to authenticated

using (
    auth.uid() = user_id
)

with check (
    auth.uid() = user_id
);


-- User can delete only their own files
create policy "Users can delete their own files"

on public.user_files

for delete

to authenticated

using (
    auth.uid() = user_id
);


-- ============================================
-- STORAGE POLICIES
-- ============================================

-- View / download own files
create policy "Users can view their own stored files"

on storage.objects

for select

to authenticated

using (

    bucket_id = 'user-files'

    and

    (storage.foldername(name))[1]
    = (select auth.uid()::text)

);


-- Upload own files
create policy "Users can upload their own stored files"

on storage.objects

for insert

to authenticated

with check (

    bucket_id = 'user-files'

    and

    (storage.foldername(name))[1]
    = (select auth.uid()::text)

);


-- Delete own files
create policy "Users can delete their own stored files"

on storage.objects

for delete

to authenticated

using (

    bucket_id = 'user-files'

    and

    (storage.foldername(name))[1]
    = (select auth.uid()::text)

);