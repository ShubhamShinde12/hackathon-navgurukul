# LearnTrack — Solution Approach Document

**NavGurukul Hackathon 2026 | Challenge 4: Progressive Student Dashboard**

**Author:** [Your Name]  
**Role Applied:** Full-Stack Developer  
**Repository:** [Your GitHub URL]  
**Date:** August 22, 2026

---

## 1. Problem Statement

Educational platforms need a way to help students understand *where they are* in their learning journey — not just which lessons exist, but how much time they've invested, how progress compares across courses, and what they should study next. Mentors also need visibility into cohort-level progress without digging through raw logs.

**Challenge requirements mapped to our solution:**

| Requirement | Implementation |
|-------------|----------------|
| Email authentication + roles | JWT auth with Student and Mentor roles |
| Completed lessons, time spent, progress per course | Dashboard summary API + progress bars |
| Trend chart (time series) | 30-day activity aggregation → Recharts area chart |
| Pie/donut (distribution) | Completion by course + overall status charts |
| Backend API | REST endpoints for auth, aggregates, lessons, activity |
| Seeded sample data | Prisma seed script with 3 courses, 18 lessons, 30 days of activity |
| Stretch: recommendations | Rule-based next-lesson suggestions per course |
| Stretch: CSV export | `/api/export/progress` endpoint |
| Stretch: mentor dashboard | Mentor-only route showing all students |
| Stretch: responsive UI | Tailwind responsive grid + mobile navigation |

---

## 2. Solution Overview

**LearnTrack** is a full-stack progressive student dashboard that:

1. Authenticates users via email/password with role-based access (Student vs Mentor)
2. Aggregates learning data from two event types: **lesson completions** and **activity events** (time spent)
3. Presents insights through stat cards, trend charts, and donut charts
4. Recommends the next uncompleted lesson in each in-progress course
5. Allows mentors to monitor all students from a dedicated view

The application is designed as a **classic three-tier architecture** — React SPA frontend, Express REST API, SQLite database — optimized for fast local setup and reliable demo during the hackathon.

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  React 18 + Vite + TypeScript + Tailwind CSS + Recharts         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Login   │  │Dashboard │  │ Courses  │  │Mentor View   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
│         AuthContext (JWT stored in localStorage)                │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/JSON (Bearer Token)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API SERVER (Node.js + Express)                │
│  ┌─────────┐ ┌───────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐ │
│  │  Auth   │ │ Dashboard │ │ Courses │ │ Lessons│ │ Mentor  │ │
│  │ Routes  │ │  Routes   │ │ Routes  │ │ Routes │ │ Routes  │ │
│  └─────────┘ └───────────┘ └─────────┘ └────────┘ └─────────┘ │
│              JWT Middleware + Role-based Access Control          │
└────────────────────────────┬────────────────────────────────────┘
                             │ Prisma ORM
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (SQLite)                           │
│   User │ Course │ Lesson │ LessonCompletion │ ActivityEvent     │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Request Flow (Example: Student Dashboard Load)

```
Student opens /dashboard
        │
        ▼
Frontend reads JWT from localStorage
        │
        ▼
Parallel API calls (all with Authorization: Bearer <token>):
  • GET /api/dashboard/summary
  • GET /api/dashboard/timeseries?days=30
  • GET /api/dashboard/distribution
  • GET /api/dashboard/recommendations
        │
        ▼
Backend validates JWT → extracts userId
        │
        ▼
Prisma queries aggregate completions + activities
        │
        ▼
JSON responses rendered as stat cards + Recharts visualizations
```

### 3.3 Technology Choices

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React 18 + Vite | Fast HMR, component-based UI, industry standard |
| Styling | Tailwind CSS | Rapid, consistent, responsive design without custom CSS files |
| Charts | Recharts | Native React chart library; area + pie charts with minimal config |
| Backend | Express + TypeScript | Lightweight REST API; type safety on server |
| ORM | Prisma | Schema-as-code, migrations, type-safe queries, easy seeding |
| Database | SQLite | Zero-config; single file; perfect for local demo |
| Auth | JWT + bcrypt | Stateless auth; no session store needed; passwords hashed |

### 3.4 Project Structure

```
hackathon-navgurukul/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Data model definition
│   │   └── seed.ts            # Demo data generator
│   └── src/
│       ├── middleware/auth.ts # JWT verification + role guard
│       ├── routes/            # Feature-based route modules
│       └── index.ts           # Express app entry point
├── frontend/
│   └── src/
│       ├── context/           # Auth state (React Context)
│       ├── components/        # Reusable UI + chart components
│       ├── pages/             # Route-level page components
│       └── lib/api.ts         # Axios client with interceptors
├── API.md                     # Endpoint documentation
└── README.md                  # Setup instructions
```

---

## 4. Data Model

### 4.1 Entity-Relationship Overview

```
User (1) ──────< (N) LessonCompletion >────── (N) Lesson
  │                                              │
  │                                              │
  └──────< (N) ActivityEvent >──────────────────┘
                                              │
Course (1) ──────< (N) Lesson ────────────────┘
```

### 4.2 Tables / Models

#### User
Stores authenticated accounts with role-based access.

| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| email | String (unique) | Login identifier |
| password | String | bcrypt hash (never stored plain text) |
| name | String | Display name |
| role | Enum: STUDENT, MENTOR | Determines UI and API access |
| createdAt | DateTime | Account creation timestamp |

#### Course
A learning program containing ordered lessons.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| title | String | e.g. "JavaScript Fundamentals" |
| description | String | Course summary |
| category | String | Grouping label (Programming, CS, etc.) |

#### Lesson
Individual learning unit within a course.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| title | String | Lesson name |
| durationMin | Int | Expected duration in minutes |
| order | Int | Sequence within course |
| courseId | FK → Course | Parent course |

#### LessonCompletion
Records that a student finished a lesson. One row per user per lesson (enforced by unique constraint).

| Field | Type | Description |
|-------|------|-------------|
| userId | FK → User | Who completed it |
| lessonId | FK → Lesson | Which lesson |
| completedAt | DateTime | When it was marked complete |

#### ActivityEvent
Tracks time spent learning — powers trend charts and total hours.

| Field | Type | Description |
|-------|------|-------------|
| userId | FK → User | Student |
| lessonId | FK → Lesson (optional) | Associated lesson, if any |
| minutes | Int | Time spent in this session |
| date | DateTime | When the activity occurred |
| type | Enum: LESSON, PRACTICE, REVIEW | Activity category |

### 4.3 Design Decisions

1. **Separated completions from activity events** — A student can spend time on a lesson without completing it (partial sessions). Completions are binary milestones; activities are continuous time tracking.

2. **Unique constraint on (userId, lessonId) for completions** — Prevents duplicate completion records and simplifies progress calculation to a simple count.

3. **SQLite for hackathon scope** — Relational data (courses → lessons → completions) maps naturally to SQL. SQLite avoids Docker/PostgreSQL setup friction during a timed demo.

4. **Role stored on User, not separate tables** — Two roles with different views don't warrant separate Student/Mentor tables at this scale. A simple enum keeps queries straightforward.

---

## 5. API Design

All protected endpoints require: `Authorization: Bearer <JWT>`

### Core Endpoints

| Method | Endpoint | Purpose | Role |
|--------|----------|---------|------|
| POST | /api/auth/login | Email/password login | Public |
| POST | /api/auth/register | Create student account | Public |
| GET | /api/auth/me | Current user profile | Any |
| GET | /api/dashboard/summary | Aggregated stats + course progress | Student |
| GET | /api/dashboard/timeseries | Daily minutes for trend chart | Student |
| GET | /api/dashboard/distribution | Pie chart data | Student |
| GET | /api/dashboard/recommendations | Next suggested lessons | Student |
| GET | /api/courses | All courses with progress % | Student |
| GET | /api/courses/:id | Course detail + lesson list | Student |
| GET | /api/lessons/:id | Lesson detail + activity history | Student |
| POST | /api/lessons/:id/complete | Mark lesson done + log activity | Student |
| GET | /api/mentor/students | All students' progress | Mentor |
| GET | /api/export/progress | CSV download | Student |

### Aggregation Logic (Dashboard Summary)

```
completedLessons = COUNT(LessonCompletion WHERE userId = current)
totalLessons     = COUNT(Lesson)
overallProgress  = (completedLessons / totalLessons) × 100
totalMinutes     = SUM(ActivityEvent.minutes WHERE userId = current)

Per course:
  progressPercent = (completed in course / total lessons in course) × 100
```

### Recommendation Algorithm (Rule-Based)

For each course:
1. Find the first lesson (by `order`) that the student has **not** completed
2. Assign a reason string based on progress state:
   - 0 completions → "Start this course"
   - Partial completions → "Continue where you left off"
3. Return up to 3 recommendations across all courses

This is intentionally simple — no ML required, deterministic, and explainable to judges in a demo.

---

## 6. Frontend Design

### 6.1 Pages

| Route | Component | Description |
|-------|-----------|-------------|
| /login | LoginPage | Split-screen auth with demo credentials |
| / | DashboardPage | Stats, charts, recommendations (student only) |
| /courses | CoursesPage | Course cards with progress bars |
| /courses/:id | CourseDetailPage | Lesson list with completion status |
| /lessons/:id | LessonDetailPage | Lesson info + mark complete button |
| /mentor | MentorPage | Student overview (mentor only) |

### 6.2 Key UI Components

- **StatCard** — Top-level KPIs (lessons completed, hours, progress %)
- **TrendChart** — Recharts area chart for 30-day learning time
- **CompletionChart** — Dual donut charts (by course + overall status)
- **CourseProgressList** — Progress bars per course with links
- **RecommendationList** — Adaptive next-step cards
- **Sidebar / MobileNav** — Role-aware navigation with CSV export

### 6.3 Auth Flow

1. User submits email + password on `/login`
2. Backend returns JWT + user object
3. Frontend stores both in `localStorage`
4. Axios interceptor attaches `Bearer` token to all API requests
5. On 401 response → clear storage → redirect to login
6. Mentor users auto-redirect from `/` to `/mentor`

---

## 7. Why This Solution Works

### 7.1 Meets All Core Requirements

Every mandatory feature from Challenge 4 is implemented and demonstrable in under 5 minutes: auth, dashboard metrics, two chart types, REST API, and seeded data with clear setup docs.

### 7.2 Appropriate Scope for a Hackathon

The architecture is **deliberately simple** — no microservices, no message queues, no external auth providers. This means:

- Setup takes ~2 minutes (`npm install` + `npm run db:setup`)
- Demo runs entirely on localhost with zero deployment
- Judges can clone the repo and verify immediately

### 7.3 Clean Separation of Concerns

- **Frontend** handles presentation and user interaction only
- **Backend** owns business logic, aggregation, and authorization
- **Database** is the single source of truth

This makes the codebase easy to explain: "The dashboard page calls four API endpoints; the backend queries Prisma; Prisma reads SQLite."

### 7.4 Extensible Data Model

The schema supports future features without redesign:

- Add `Enrollment` table for multi-tenant cohorts
- Add `QuizResult` for assessment tracking
- Swap SQLite → PostgreSQL by changing one connection string
- Replace rule-based recommendations with an ML service behind the same API contract

### 7.5 Stretch Goals Included

Beyond the MVP, the project includes adaptive recommendations, CSV export, mentor dashboard, and responsive mobile navigation — demonstrating awareness of real product needs.

### 7.6 Open Source & Self-Contained

No paid API keys, no proprietary services. Entire stack is open source and runs offline — aligned with hackathon constraints.

---

## 8. Drawbacks & Limitations

Being honest about limitations is important for evaluation. This solution makes deliberate trade-offs:

### 8.1 SQLite Is Not Production-Ready at Scale

SQLite works for demos and small deployments but lacks concurrent write performance for many simultaneous users. **Production fix:** Migrate to PostgreSQL with connection pooling.

### 8.2 JWT in localStorage Has Security Trade-offs

Storing JWT in `localStorage` is vulnerable to XSS attacks. **Production fix:** Use HTTP-only secure cookies with refresh token rotation, or a dedicated auth provider (Auth0, Clerk).

### 8.3 Recommendations Are Rule-Based, Not Truly Adaptive

The "adaptive recommendations" feature picks the next uncompleted lesson by order — it doesn't consider learning speed, difficulty, or past performance. **Improvement:** Score lessons by completion time, quiz results, or spaced-repetition algorithms.

### 8.4 No Real-Time Updates

If a mentor and student use the app simultaneously, the mentor won't see live updates without refreshing. **Improvement:** Add WebSocket or Server-Sent Events for live progress sync.

### 8.5 Time Tracking Is Simulated, Not Measured

Activity events in seed data are randomly generated. The "mark complete" action logs the lesson's expected duration, not actual time on page. **Improvement:** Add a session timer or integrate with video player watch-time APIs.

### 8.6 No Input Validation on Frontend

While the backend uses Zod for validation, the frontend relies on HTML5 `required` attributes. **Improvement:** Add client-side schema validation (e.g. Zod + React Hook Form).

### 8.7 No Automated Tests

The hackathon timeline prioritized a working demo over test coverage. **Improvement:** Add Jest/Vitest unit tests for aggregation logic and Playwright E2E tests for auth + dashboard flows.

### 8.8 Single-Tenant / No Organization Model

All students share the same course catalog. There's no concept of batches, campuses, or assigned mentors. **Improvement:** Add `Cohort` and `Enrollment` entities with mentor-student assignments.

---

## 9. Future Roadmap

If this were extended beyond the hackathon:

1. **Phase 1:** PostgreSQL deployment + Docker Compose + environment-based config
2. **Phase 2:** Real session timer + video integration for accurate time tracking
3. **Phase 3:** Quiz/assessment module with score-based recommendations
4. **Phase 4:** Mentor annotations + messaging on student progress
5. **Phase 5:** Admin panel for course/lesson CRUD

---

## 10. How to Run & Demo

### Setup (one-time)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run db:setup
npm run dev          # http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Demo Script (5 minutes)

1. Open http://localhost:5173 → login as `student@demo.com` / `password123`
2. Walk through dashboard: stat cards → trend chart → donut charts → course progress
3. Click a recommended lesson → mark as complete → return to dashboard (progress updated)
4. Export CSV from sidebar
5. Logout → login as `mentor@demo.com` / `password123` → show student overview

---

## 11. Conclusion

LearnTrack delivers a complete, demo-ready progressive student dashboard within hackathon constraints. The architecture prioritizes **clarity over complexity** — every layer has a single responsibility, the data model directly maps to user-facing features, and the stack is 100% open source with zero external dependencies.

The main trade-off is production readiness versus speed of delivery. For a hackathon proof-of-concept, this is the right balance: a working product that judges can run locally, understand architecturally, and see extended with clear next steps.

---

*Built for NavGurukul Hackathon 2026 — Challenge 4: Progressive Student Dashboard*
