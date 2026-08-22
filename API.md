# API Documentation

Base URL: `http://localhost:3001/api`

All protected routes require header: `Authorization: Bearer <token>`

---

## Auth

### POST /auth/register
Register a new student account.

**Body:**
```json
{ "email": "user@example.com", "password": "password123", "name": "Optional Name" }
```

**Response (201):**
```json
{ "token": "jwt...", "user": { "id": "...", "email": "...", "name": "...", "role": "STUDENT" } }
```

### POST /auth/login
**Body:**
```json
{ "email": "student@demo.com", "password": "password123" }
```

**Response (200):**
```json
{ "token": "jwt...", "user": { "id": "...", "email": "...", "name": "...", "role": "STUDENT" } }
```

### GET /auth/me
Returns current authenticated user. Requires token.

---

## Dashboard (Student)

### GET /dashboard/summary
Aggregated progress metrics.

**Response:**
```json
{
  "completedLessons": 10,
  "totalLessons": 18,
  "overallProgress": 56,
  "totalMinutes": 420,
  "totalHours": 7,
  "courseProgress": [
    { "courseId": "...", "title": "JavaScript Fundamentals", "completed": 5, "total": 6, "progressPercent": 83 }
  ],
  "recentCompletions": [
    { "id": "...", "lessonTitle": "...", "courseTitle": "...", "completedAt": "2026-08-20T..." }
  ]
}
```

### GET /dashboard/timeseries?days=30
Daily learning time for trend chart.

**Response:**
```json
[{ "date": "2026-08-01", "minutes": 45, "hours": 0.8 }]
```

### GET /dashboard/distribution
Data for pie/donut charts.

**Response:**
```json
{
  "byCourse": [{ "name": "JavaScript Fundamentals", "completed": 5, "pending": 1, "total": 6, "value": 5 }],
  "completionStatus": [
    { "name": "Completed", "value": 10, "color": "#6366f1" },
    { "name": "Remaining", "value": 8, "color": "#e2e8f0" }
  ]
}
```

### GET /dashboard/recommendations
Adaptive next-step suggestions (up to 3).

**Response:**
```json
[{
  "lessonId": "...",
  "lessonTitle": "DOM Manipulation",
  "courseTitle": "JavaScript Fundamentals",
  "durationMin": 30,
  "reason": "Continue where you left off"
}]
```

---

## Courses

### GET /courses
List all courses with progress for current user.

### GET /courses/:id
Course detail with lessons and completion status.

---

## Lessons

### GET /lessons/:id
Lesson detail with activity history.

### POST /lessons/:id/complete
Mark lesson as complete and log activity event.

---

## Activity Events

### GET /activity?limit=20
Recent activity events for current user.

### POST /activity
Log a new activity event.

**Body:**
```json
{ "lessonId": "optional-id", "minutes": 30, "type": "LESSON", "date": "2026-08-22T10:00:00.000Z" }
```

---

## Mentor (requires MENTOR role)

### GET /mentor/students
List all students with progress summary.

**Response:**
```json
[{
  "id": "...",
  "name": "Arjun Patel",
  "email": "student@demo.com",
  "overallProgress": 56,
  "completedLessons": 10,
  "totalLessons": 18,
  "totalHours": 7.2,
  "courseBreakdown": [{ "title": "JavaScript Fundamentals", "completed": 5, "total": 0 }]
}]
```

---

## Export

### GET /export/progress
Download CSV of all lesson progress for current student.

**Response:** `text/csv` file attachment

---

## Health

### GET /health
```json
{ "status": "ok", "timestamp": "..." }
```
