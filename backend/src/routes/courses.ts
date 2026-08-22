import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const userId = req.user!.userId;

  const courses = await prisma.course.findMany({
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
    orderBy: { title: "asc" },
  });

  const completions = await prisma.lessonCompletion.findMany({
    where: { userId },
    select: { lessonId: true },
  });
  const completedSet = new Set(completions.map((c) => c.lessonId));

  const result = courses.map((course) => {
    const completed = course.lessons.filter((l) => completedSet.has(l.id)).length;
    const total = course.lessons.length;
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      lessonCount: total,
      completedCount: completed,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  res.json(result);
});

router.get("/:id", async (req, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  const completions = await prisma.lessonCompletion.findMany({
    where: { userId, lessonId: { in: course.lessons.map((l) => l.id) } },
  });
  const completedMap = new Map(completions.map((c) => [c.lessonId, c.completedAt]));

  res.json({
    ...course,
    lessons: course.lessons.map((l) => ({
      ...l,
      completed: completedMap.has(l.id),
      completedAt: completedMap.get(l.id) ?? null,
    })),
    progressPercent:
      course.lessons.length > 0
        ? Math.round((completions.length / course.lessons.length) * 100)
        : 0,
  });
});

export default router;
