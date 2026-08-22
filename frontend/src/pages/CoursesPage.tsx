import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import api from "../lib/api";
import type { CourseListItem } from "../types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
        <p className="mt-1 text-slate-500">Browse all available courses and track your progress</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="card group transition hover:border-brand-200 hover:shadow-card-hover"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {course.category}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">{course.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{course.description}</p>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-500">
                  {course.completedCount}/{course.lessonCount} lessons
                </span>
                <span className="font-medium text-brand-600">{course.progressPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-brand-600">
              View course
              <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
