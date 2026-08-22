import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/:id", async (req, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      course: true,
      completions: { where: { userId } },
      activities: {
        where: { userId },
        orderBy: { date: "desc" },
        take: 10,
      },
    },
  });

  if (!lesson) {
    return res.status(404).json({ error: "Lesson not found" });
  }

  const totalTime = lesson.activities.reduce((s, a) => s + a.minutes, 0);

  res.json({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    durationMin: lesson.durationMin,
    order: lesson.order,
    course: {
      id: lesson.course.id,
      title: lesson.course.title,
    },
    completed: lesson.completions.length > 0,
    completedAt: lesson.completions[0]?.completedAt ?? null,
    totalTimeSpent: totalTime,
    recentActivity: lesson.activities,
  });
});

router.post("/:id/complete", async (req, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) {
    return res.status(404).json({ error: "Lesson not found" });
  }

  const completion = await prisma.lessonCompletion.upsert({
    where: { userId_lessonId: { userId, lessonId: id } },
    create: { userId, lessonId: id },
    update: { completedAt: new Date() },
  });

  await prisma.activityEvent.create({
    data: {
      userId,
      lessonId: id,
      minutes: lesson.durationMin,
      date: new Date(),
      type: "LESSON",
    },
  });

  res.json({ message: "Lesson marked complete", completion });
});

export default router;
