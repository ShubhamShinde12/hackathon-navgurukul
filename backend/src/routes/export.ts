import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/progress", async (req, res) => {
  const userId = req.user!.userId;

  const [completions, courses, activities] = await Promise.all([
    prisma.lessonCompletion.findMany({
      where: { userId },
      include: { lesson: { include: { course: true } } },
    }),
    prisma.course.findMany({ include: { lessons: true } }),
    prisma.activityEvent.findMany({ where: { userId } }),
  ]);

  const totalMinutes = activities.reduce((s, a) => s + a.minutes, 0);
  const rows = [
    "Course,Lesson,Status,Completed At,Duration (min)",
  ];

  for (const course of courses) {
    for (const lesson of course.lessons) {
      const completion = completions.find((c) => c.lessonId === lesson.id);
      rows.push(
        [
          `"${course.title}"`,
          `"${lesson.title}"`,
          completion ? "Completed" : "Pending",
          completion ? completion.completedAt.toISOString().split("T")[0] : "",
          lesson.durationMin,
        ].join(",")
      );
    }
  }

  rows.push("");
  rows.push(`Total Lessons Completed,${completions.length}`);
  rows.push(`Total Time (minutes),${totalMinutes}`);
  rows.push(`Total Time (hours),${Math.round((totalMinutes / 60) * 10) / 10}`);

  const csv = rows.join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="learning-progress.csv"');
  res.send(csv);
});

export default router;
