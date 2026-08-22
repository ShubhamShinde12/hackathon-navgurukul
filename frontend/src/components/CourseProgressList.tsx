import { Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import type { CourseProgress } from "../types";

interface CourseProgressListProps {
  courses: CourseProgress[];
}

export default function CourseProgressList({ courses }: CourseProgressListProps) {
  return (
    <div className="card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Course Progress</h3>
          <p className="text-sm text-slate-500">Track completion across all enrolled courses</p>
        </div>
        <Link to="/courses" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>
      <div className="space-y-5">
        {courses.map((course) => (
          <div key={course.courseId}>
            <div className="mb-2 flex items-center justify-between">
              <Link
                to={`/courses/${course.courseId}`}
                className="font-medium text-slate-800 hover:text-brand-600"
              >
                {course.title}
              </Link>
              <span className="text-sm text-slate-500">
                {course.completed}/{course.total} lessons
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs font-medium text-brand-600">
              {course.progressPercent}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RecommendationListProps {
  recommendations: {
    lessonId: string;
    lessonTitle: string;
    courseTitle: string;
    durationMin: number;
    reason: string;
  }[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Recommended Next Steps</h3>
        <p className="text-sm text-slate-500">Adaptive suggestions based on your progress</p>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <Link
            key={rec.lessonId}
            to={`/lessons/${rec.lessonId}`}
            className="group flex items-center justify-between rounded-lg border border-surface-border p-4 transition hover:border-brand-200 hover:bg-brand-50/50"
          >
            <div>
              <p className="font-medium text-slate-800 group-hover:text-brand-700">{rec.lessonTitle}</p>
              <p className="text-sm text-slate-500">{rec.courseTitle}</p>
              <p className="mt-1 text-xs text-brand-600">{rec.reason}</p>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1 text-xs">
                <Clock className="h-3.5 w-3.5" />
                {rec.durationMin}m
              </span>
              <ChevronRight className="h-5 w-5 group-hover:text-brand-600" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
