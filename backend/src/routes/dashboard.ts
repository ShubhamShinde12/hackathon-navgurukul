import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/summary", async (req, res) => {
  const userId = req.user!.userId;

  const [completions, activities, totalLessons] = await Promise.all([
    prisma.lessonCompletion.findMany({
      where: { userId },
      include: { lesson: { include: { course: true } } },
    }),
    prisma.activityEvent.findMany({ where: { userId } }),
    prisma.lesson.count(),
  ]);

  const totalMinutes = activities.reduce((sum, a) => sum + a.minutes, 0);
  const completedLessons = completions.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const courseMap = new Map<string, { courseId: string; title: string; completed: number; total: number }>();

  const allCourses = await prisma.course.findMany({
    include: { lessons: true },
  });

  for (const course of allCourses) {
    courseMap.set(course.id, {
      courseId: course.id,
      title: course.title,
      completed: 0,
      total: course.lessons.length,
    });
  }

  for (const c of completions) {
    const entry = courseMap.get(c.lesson.courseId);
    if (entry) entry.completed += 1;
  }

  const courseProgress = Array.from(courseMap.values()).map((c) => ({
    ...c,
    progressPercent: c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0,
  }));

  const recentCompletions = completions
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      lessonTitle: c.lesson.title,
      courseTitle: c.lesson.course.title,
      completedAt: c.completedAt,
    }));

  res.json({
    completedLessons,
    totalLessons,
    overallProgress,
    totalMinutes,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    courseProgress,
    recentCompletions,
  });
});

router.get("/timeseries", async (req, res) => {
  const userId = req.user!.userId;
  const days = parseInt(req.query.days as string) || 30;

  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const activities = await prisma.activityEvent.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "asc" },
  });

  const dailyMap = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    dailyMap.set(d.toISOString().split("T")[0], 0);
  }

  for (const a of activities) {
    const key = a.date.toISOString().split("T")[0];
    if (dailyMap.has(key)) {
      dailyMap.set(key, (dailyMap.get(key) || 0) + a.minutes);
    }
  }

  const data = Array.from(dailyMap.entries()).map(([date, minutes]) => ({
    date,
    minutes,
    hours: Math.round((minutes / 60) * 10) / 10,
  }));

  res.json(data);
});

router.get("/distribution", async (req, res) => {
  const userId = req.user!.userId;

  const [completions, courses] = await Promise.all([
    prisma.lessonCompletion.findMany({
      where: { userId },
      include: { lesson: true },
    }),
    prisma.course.findMany({ include: { lessons: true } }),
  ]);

  const byCourse = courses.map((course) => {
    const completed = completions.filter((c) => c.lesson.courseId === course.id).length;
    const total = course.lessons.length;
    const pending = total - completed;
    return {
      name: course.title,
      completed,
      pending,
      total,
      value: completed,
    };
  });

  const totalCompleted = completions.length;
  const totalAll = courses.reduce((s, c) => s + c.lessons.length, 0);
  const totalPending = totalAll - totalCompleted;

  res.json({
    byCourse,
    completionStatus: [
      { name: "Completed", value: totalCompleted, color: "#6366f1" },
      { name: "Remaining", value: totalPending, color: "#e2e8f0" },
    ],
  });
});

router.get("/recommendations", async (req, res) => {
  const userId = req.user!.userId;

  const completions = await prisma.lessonCompletion.findMany({
    where: { userId },
    select: { lessonId: true },
  });
  const completedIds = new Set(completions.map((c) => c.lessonId));

  const courses = await prisma.course.findMany({
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  const recommendations: {
    lessonId: string;
    lessonTitle: string;
    courseTitle: string;
    durationMin: number;
    reason: string;
  }[] = [];

  for (const course of courses) {
    const nextLesson = course.lessons.find((l) => !completedIds.has(l.id));
    if (nextLesson) {
      const completedInCourse = course.lessons.filter((l) => completedIds.has(l.id)).length;
      const reason =
        completedInCourse === 0
          ? "Start this course — no lessons completed yet"
          : completedInCourse > 0 && completedInCourse < course.lessons.length
            ? "Continue where you left off"
            : "Review recommended next step";

      recommendations.push({
        lessonId: nextLesson.id,
        lessonTitle: nextLesson.title,
        courseTitle: course.title,
        durationMin: nextLesson.durationMin,
        reason,
      });
    }
  }

  res.json(recommendations.slice(0, 3));
});

export default router;
