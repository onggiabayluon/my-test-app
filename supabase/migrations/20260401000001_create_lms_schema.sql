-- ============================================================
-- Migration: Create LMS schema (Parents, Students, Classes, Registrations, Subscriptions)
-- ============================================================

-- 1. Parents table
create table parents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

-- 2. Students table
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dob date,
  gender text,
  current_grade text,
  parent_id uuid references parents(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 3. Classes table
create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  day_of_week text not null,
  time_slot text not null,
  teacher_name text not null,
  max_students int not null default 20,
  created_at timestamptz not null default now()
);

-- 4. Class registrations table
create table class_registrations (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique(class_id, student_id)
);

-- 5. Subscriptions table
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  package_name text not null,
  start_date date not null,
  end_date date not null,
  total_sessions int not null,
  used_sessions int not null default 0,
  created_at timestamptz not null default now()
);

-- 6. Indexes
create index idx_students_parent_id on students(parent_id);
create index idx_class_registrations_class_id on class_registrations(class_id);
create index idx_class_registrations_student_id on class_registrations(student_id);
create index idx_subscriptions_student_id on subscriptions(student_id);

-- 7. Enable Row Level Security
alter table parents enable row level security;
alter table students enable row level security;
alter table classes enable row level security;
alter table class_registrations enable row level security;
alter table subscriptions enable row level security;

-- 8. RLS policies — public read/write for MVP
create policy "Public access on parents" on parents for all using (true) with check (true);
create policy "Public access on students" on students for all using (true) with check (true);
create policy "Public access on classes" on classes for all using (true) with check (true);
create policy "Public access on class_registrations" on class_registrations for all using (true) with check (true);
create policy "Public access on subscriptions" on subscriptions for all using (true) with check (true);

-- 9. Seed data: 2 parents
insert into parents (id, name, phone, email) values
  ('a1000000-0000-0000-0000-000000000001', 'Nguyen Van An', '0901234567', 'an.nguyen@example.com'),
  ('a1000000-0000-0000-0000-000000000002', 'Tran Thi Binh', '0912345678', 'binh.tran@example.com');

-- 10. Seed data: 3 students
insert into students (id, name, dob, gender, current_grade, parent_id) values
  ('b1000000-0000-0000-0000-000000000001', 'Nguyen Minh Khoa', '2012-03-15', 'male', 'Grade 6', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000002', 'Nguyen Lan Anh', '2014-07-20', 'female', 'Grade 4', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000003', 'Tran Duc Huy', '2011-11-05', 'male', 'Grade 7', 'a1000000-0000-0000-0000-000000000002');

-- 11. Seed data: 3 classes
insert into classes (id, name, subject, day_of_week, time_slot, teacher_name, max_students) values
  ('c1000000-0000-0000-0000-000000000001', 'Toan Co Ban A1', 'Math', 'Monday', '08:00-09:30', 'Mr. Tuan', 5),
  ('c1000000-0000-0000-0000-000000000002', 'Tieng Anh Giao Tiep B2', 'English', 'Wednesday', '14:00-15:30', 'Ms. Linh', 10),
  ('c1000000-0000-0000-0000-000000000003', 'Vat Ly Nang Cao', 'Physics', 'Monday', '10:00-11:30', 'Mr. Hung', 8);

-- 12. Seed data: subscriptions for all 3 students
insert into subscriptions (id, student_id, package_name, start_date, end_date, total_sessions, used_sessions) values
  ('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Basic 10', '2026-04-01', '2026-06-30', 10, 2),
  ('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'Standard 20', '2026-04-01', '2026-07-31', 20, 0),
  ('d1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'Premium 30', '2026-04-01', '2026-09-30', 30, 5);
