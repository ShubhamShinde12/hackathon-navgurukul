import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

const activitySchema = z.object({
  lessonId: z.string().optional(),
  minutes: z.number().int().min(1).max(480),
  type: z.enum(["LESSON", "PRACTICE", "REVIEW"]).optional(),
  date: z.string().datetime().optional(),
});

router.get("/", async (req, res) => {
  const userId = req.user!.userId;
  const limit = parseInt(req.query.limit as string) || 20;

  const events = await prisma.activityEvent.findMany({
    where: { userId },
    include: {
      lesson: { select: { title: true, course: { select: { title: true } } } },
    },
    orderBy: { date: "desc" },
    take: limit,
  });

  res.json(events);
});

router.post("/", async (req, res) => {
  const parsed = activitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { lessonId, minutes, type, date } = parsed.data;

  const event = await prisma.activityEvent.create({
    data: {
      userId: req.user!.userId,
      lessonId: lessonId ?? null,
      minutes,
      type: type ?? "LESSON",
      date: date ? new Date(date) : new Date(),
    },
  });

  res.status(201).json(event);
});

export default router;
