import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";
import api from "../lib/api";
import type { CourseDetail } from "../types";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/courses/${id}`).then((res) => setCourse(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!course) {
    return <p className="text-slate-500">Course not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Link>

      <div className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
              {course.category}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{course.title}</h1>
            <p className="mt-2 max-w-2xl text-slate-500">{course.description}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-brand-600">{course.progressPercent}%</p>
            <p className="text-sm text-slate-500">
              {course.completedCount} of {course.lessonCount} lessons
            </p>
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Lessons</h2>
        <div className="divide-y divide-surface-border">
          {course.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/lessons/${lesson.id}`}
              className="flex items-center gap-4 py-4 transition first:pt-0 last:pb-0 hover:bg-slate-50 -mx-2 px-2 rounded-lg"
            >
              {lesson.completed ? (
                <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-500" />
              ) : (
                <Circle className="h-6 w-6 flex-shrink-0 text-slate-300" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${lesson.completed ? "text-slate-600" : "text-slate-900"}`}>
                  {lesson.order}. {lesson.title}
                </p>
                {lesson.completedAt && (
                  <p className="text-xs text-slate-400">
                    Completed {new Date(lesson.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <Clock className="h-4 w-4" />
                {lesson.durationMin}m
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
