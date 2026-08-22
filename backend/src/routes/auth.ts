import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authMiddleware, signToken } from "../middleware/auth";

const router = Router();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
});

router.post("/register", async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      name: name || email.split("@")[0],
    },
  });

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.post("/login", async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid email or password format" });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

export default router;
