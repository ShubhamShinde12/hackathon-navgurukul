import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Users, BookOpen, Clock, TrendingUp } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { MentorStudent } from "../types";

export default function MentorPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<MentorStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "MENTOR") return;
    api.get("/mentor/students").then((res) => setStudents(res.data)).finally(() => setLoading(false));
  }, [user]);

  if (user?.role === "STUDENT") {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  const avgProgress =
    students.length > 0
      ? Math.round(students.reduce((s, st) => s + st.overallProgress, 0) / students.length)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Overview</h1>
        <p className="mt-1 text-slate-500">Monitor progress across all students in your cohort</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-900">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg. Progress</p>
              <p className="text-2xl font-bold text-slate-900">{avgProgress}%</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Completions</p>
              <p className="text-2xl font-bold text-slate-900">
                {students.reduce((s, st) => s + st.completedLessons, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.id} className="card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{student.name}</h3>
                <p className="text-sm text-slate-500">{student.email}</p>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-slate-500">Progress</p>
                  <p className="font-semibold text-brand-600">{student.overallProgress}%</p>
                </div>
                <div>
                  <p className="text-slate-500">Lessons</p>
                  <p className="font-semibold text-slate-800">
                    {student.completedLessons}/{student.totalLessons}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Time</p>
                  <p className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="h-3.5 w-3.5" />
                    {student.totalHours}h
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${student.overallProgress}%` }}
              />
            </div>
            {student.courseBreakdown.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {student.courseBreakdown.map((c) => (
                  <span
                    key={c.title}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                  >
                    {c.title}: {c.completed} done
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
