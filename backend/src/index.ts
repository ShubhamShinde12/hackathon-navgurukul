import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import courseRoutes from "./routes/courses";
import lessonRoutes from "./routes/lessons";
import activityRoutes from "./routes/activity";
import mentorRoutes from "./routes/mentor";
import exportRoutes from "./routes/export";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/export", exportRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
