# TeenUp LMS — Mini App

A mini Learning Management System built with **Next.js 15** + **Supabase** for managing Students, Parents, Classes, Registrations, and Subscriptions.

---

## Progress

- [x] Database migration (5 tables + seed data)
- [x] Parent API (`POST /api/parents`, `GET /api/parents/:id`)
- [x] Student API (`POST /api/students`, `GET /api/students/:id`)
- [x] Class API (`POST /api/classes`, `GET /api/classes?day=`)
- [x] Registration API with business rules (`POST /api/classes/:id/register`, `DELETE /api/registrations/:id`)
- [x] Subscription API (`POST /api/subscriptions`, `GET /api/subscriptions/:id`, `PATCH /api/subscriptions/:id/use`)
- [x] Frontend: Dashboard
- [x] Frontend: Create Parent form
- [x] Frontend: Create Student form
- [x] Frontend: Weekly class schedule + register modal
- [x] Dockerfile + docker-compose.yml
- [x] README

---

## Quick Start

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project (hosted)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env.local
# Fill in your values from Supabase dashboard → Project Settings → API
# NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 3. Apply migrations to your hosted Supabase project
```bash
# Link to your Supabase project (get project-ref from the dashboard URL)
npx supabase link --project-ref <project-ref>

# Push migrations + seed data
npx supabase db push
```

### 4. Run the app
```bash
npm run dev
# Open http://localhost:3000
```

> **Local dev with Docker (optional):** If you want to run Supabase locally instead,
> install [Docker Desktop](https://docs.docker.com/desktop), then run `npx supabase start`
> followed by `npx supabase db reset`.

---

## Docker Setup

### 1. Set environment variables
```bash
cp .env.example .env
# Edit .env and fill in:
# NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 2. Build and run with Docker Compose
```bash
docker-compose up --build
# App runs at http://localhost:3000
```

This starts the Next.js app. The `db` service in `docker-compose.yml` is a local Postgres included for completeness — the app connects to your hosted Supabase project via the env vars above.

---

## Database Schema

| Table | Key Columns |
|---|---|
| `parents` | `id`, `name`, `phone`, `email` |
| `students` | `id`, `name`, `dob`, `gender`, `current_grade`, `parent_id → parents` |
| `classes` | `id`, `name`, `subject`, `day_of_week`, `time_slot`, `teacher_name`, `max_students` |
| `class_registrations` | `id`, `class_id → classes`, `student_id → students`, `registered_at` |
| `subscriptions` | `id`, `student_id → students`, `package_name`, `start_date`, `end_date`, `total_sessions`, `used_sessions` |

---

## API Endpoints

### Parents
```
POST   /api/parents          Create a parent
GET    /api/parents          List all parents
GET    /api/parents/:id      Get parent by ID
```

### Students
```
POST   /api/students         Create a student
GET    /api/students         List all students (includes parent)
GET    /api/students/:id     Get student by ID (includes parent)
```

### Classes
```
POST   /api/classes          Create a class
GET    /api/classes          List all classes
GET    /api/classes?day=Mon  Filter by day_of_week
```

### Class Registrations
```
POST   /api/classes/:id/register   Register student into class
DELETE /api/registrations/:id      Cancel registration (refund if < 24h)
```

**Registration checks:**
1. Class must not be full (`enrolled < max_students`)
2. Student must not have another class on the same `day_of_week` + `time_slot`
3. Student must have an active subscription with remaining sessions (`end_date >= today`, `used_sessions < total_sessions`)

**Cancellation logic:**
- Cancelled within 24h of registration → 1 session refunded
- Cancelled after 24h → no refund

### Subscriptions
```
POST   /api/subscriptions           Create subscription
GET    /api/subscriptions/:id       Get subscription status
PATCH  /api/subscriptions/:id/use   Use 1 session
```

---

## Example curl Requests

```bash
BASE=http://localhost:3000

# Create parent
curl -s -X POST $BASE/api/parents \
  -H "Content-Type: application/json" \
  -d '{"name":"Le Van Cuong","phone":"0933444555","email":"cuong@example.com"}' | jq

# Create student
curl -s -X POST $BASE/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Le Thi Mai","dob":"2013-05-10","gender":"female","current_grade":"Grade 5","parent_id":"<parent_id>"}' | jq

# List classes on Monday
curl -s "$BASE/api/classes?day=Monday" | jq

# Register student into class
curl -s -X POST $BASE/api/classes/<class_id>/register \
  -H "Content-Type: application/json" \
  -d '{"student_id":"<student_id>"}' | jq

# Cancel registration
curl -s -X DELETE $BASE/api/registrations/<registration_id> | jq

# Create subscription
curl -s -X POST $BASE/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"student_id":"<student_id>","package_name":"Basic 10","start_date":"2026-04-01","end_date":"2026-06-30","total_sessions":10}' | jq

# Check subscription status
curl -s $BASE/api/subscriptions/<sub_id> | jq
```

---

## Seed Data

The migration includes:

**Parents (2)**
| Name | Phone | Email |
|---|---|---|
| Nguyen Van An | 0901234567 | an.nguyen@example.com |
| Tran Thi Binh | 0912345678 | binh.tran@example.com |

**Students (3)**
| Name | Grade | Parent |
|---|---|---|
| Nguyen Minh Khoa | Grade 6 | Nguyen Van An |
| Nguyen Lan Anh | Grade 4 | Nguyen Van An |
| Tran Duc Huy | Grade 7 | Tran Thi Binh |

**Classes (3)**
| Name | Subject | Day | Time | Teacher | Max |
|---|---|---|---|---|---|
| Toan Co Ban A1 | Math | Monday | 08:00-09:30 | Mr. Tuan | 5 |
| Tieng Anh Giao Tiep B2 | English | Wednesday | 14:00-15:30 | Ms. Linh | 10 |
| Vat Ly Nang Cao | Physics | Monday | 10:00-11:30 | Mr. Hung | 8 |

**Subscriptions** — each student has an active subscription (Basic 10 / Standard 20 / Premium 30).
