-- ============================================================
-- Migration: Create boards and tasks tables
-- ============================================================

-- 1. Create custom enum for task status
create type task_status as enum ('todo', 'in_progress', 'completed', 'wont_do');

-- 2. Create boards table
create table boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

-- 3. Create tasks table
create table tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  description text,
  icon text not null default '📝',
  status task_status not null default 'todo',
  created_at timestamptz not null default now()
);

-- 4. Create index on tasks.board_id for faster lookups
create index idx_tasks_board_id on tasks(board_id);

-- 5. Enable Row Level Security
alter table boards enable row level security;
alter table tasks enable row level security;

-- 6. RLS policies — public read/write for MVP
create policy "Public read access on boards"
  on boards for select
  using (true);

create policy "Public insert access on boards"
  on boards for insert
  with check (true);

create policy "Public update access on boards"
  on boards for update
  using (true)
  with check (true);

create policy "Public delete access on boards"
  on boards for delete
  using (true);

create policy "Public read access on tasks"
  on tasks for select
  using (true);

create policy "Public insert access on tasks"
  on tasks for insert
  with check (true);

create policy "Public update access on tasks"
  on tasks for update
  using (true)
  with check (true);

create policy "Public delete access on tasks"
  on tasks for delete
  using (true);

-- 7. Function to seed 4 default tasks for a new board
create or replace function seed_default_tasks(board_id uuid)
returns void
language plpgsql
as $$
begin
  insert into tasks (board_id, name, description, icon, status) values
    (board_id, 'Task in Progress', 'Working on project assets', '⏰', 'in_progress'),
    (board_id, 'Task Completed', 'Morning exercise routine', '🏃', 'completed'),
    (board_id, 'Task Won''t Do', 'Skip afternoon coffee break', '☕', 'wont_do'),
    (board_id, 'Task To Do', 'Read 20 pages of new book', '📚', 'todo');
end;
$$;
