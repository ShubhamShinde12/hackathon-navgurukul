# LearnTrack — Progressive Student Dashboard

Full-stack web application for **NavGurukul Hackathon Challenge 4**. Tracks student progress across courses, visualizes learning insights, and recommends next steps.

## Features

- Email authentication with **Student** and **Mentor** roles
- Student dashboard: completed lessons, time spent, course progress
- Visualizations: time-series trend chart + pie/donut completion charts
- Adaptive recommendations for next lessons
- Course & lesson detail pages with mark-complete action
- Mentor dashboard: view all students' progress
- CSV export of learning progress
- Seeded demo data for instant demo

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Recharts |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | SQLite |
| Auth | JWT + bcrypt |

## Prerequisites

- Node.js 18+ and npm

## Quick Start

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env    # or use the included .env for local dev
npm run db:setup        # creates DB + seeds demo data
npm run dev             # runs on http://localhost:3001
```

### 2. Frontend setup (new terminal)

```bash
cd frontend
npm install
npm run dev             # runs on http://localhost:5173
```

### 3. Open the app

Visit **http://localhost:5173** and sign in with demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.com | password123 |
| Student | student2@demo.com | password123 |
| Mentor | mentor@demo.com | password123 |

## Project Structure

```
hackathon-navgurukul/
├── backend/
│   ├── prisma/schema.prisma   # Database schema
│   ├── prisma/seed.ts         # Demo data seeder
│   └── src/routes/            # API route handlers
├── frontend/
│   └── src/
│       ├── components/        # UI components & charts
│       ├── pages/             # Route pages
│       └── context/           # Auth state
├── API.md                     # API documentation
└── README.md
```

## Demo Flow (for presentation)

1. **Login as student** → Show dashboard stats, trend chart, pie charts
2. **Course progress** → Click into a course, view lessons
3. **Mark lesson complete** → Return to dashboard, see updated progress
4. **Recommendations** → Show adaptive next-step suggestions
5. **Export CSV** → Download progress report from sidebar
6. **Login as mentor** → Show student overview with aggregate stats

## API Documentation

See [API.md](./API.md) for full endpoint reference.

## Approach Document (for submission PDF)

A full solution write-up is in **[APPROACH.md](./APPROACH.md)** covering architecture, data model, rationale, and drawbacks.

**To generate PDF:**
1. Open [APPROACH.html](./APPROACH.html) in Chrome/Edge → `Ctrl+P` → Save as PDF, or
2. Use VS Code extension "Markdown PDF" on `APPROACH.md`, or
3. Paste `APPROACH.md` into Google Docs → File → Download → PDF

Replace `[Your Name]` and `[Your GitHub URL]` in the document before exporting.

## Screenshots

> Add screenshots of the dashboard, charts, and mentor view before submission.

## License

MIT — built for NavGurukul Hackathon 2026.
