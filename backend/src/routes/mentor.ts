import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, requireRole } from "../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

router.use(authMiddleware);
router.use(requireRole(Role.MENTOR));

router.get("/students", async (_req, res) => {
  const students = await prisma.user.findMany({
    where: { role: Role.STUDENT },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      completions: { include: { lesson: { include: { course: true } } } },
      activities: true,
    },
  });

  const totalLessons = await prisma.lesson.count();

  const result = students.map((s) => {
    const totalMinutes = s.activities.reduce((sum, a) => sum + a.minutes, 0);
    const courseMap = new Map<string, { title: string; completed: number; total: number }>();

    for (const c of s.completions) {
      const cid = c.lesson.courseId;
      if (!courseMap.has(cid)) {
        courseMap.set(cid, { title: c.lesson.course.title, completed: 0, total: 0 });
      }
      courseMap.get(cid)!.completed += 1;
    }

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      joinedAt: s.createdAt,
      completedLessons: s.completions.length,
      totalLessons,
      overallProgress:
        totalLessons > 0 ? Math.round((s.completions.length / totalLessons) * 100) : 0,
      totalMinutes,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      courseBreakdown: Array.from(courseMap.values()),
    };
  });

  res.json(result);
});

export default router;
