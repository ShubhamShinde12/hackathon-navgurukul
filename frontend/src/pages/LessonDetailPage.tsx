import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, BookOpen } from "lucide-react";
import api from "../lib/api";

interface LessonDetail {
  id: string;
  title: string;
  description: string | null;
  durationMin: number;
  order: number;
  course: { id: string; title: string };
  completed: boolean;
  completedAt: string | null;
  totalTimeSpent: number;
  recentActivity: { id: string; minutes: number; date: string; type: string }[];
}

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const fetchLesson = () => {
    if (!id) return;
    api.get(`/lessons/${id}`).then((res) => setLesson(res.data)).finally(() => setLoading(false));
  };

  useEffect(fetchLesson, [id]);

  const handleComplete = async () => {
    if (!id || lesson?.completed) return;
    setCompleting(true);
    try {
      await api.post(`/lessons/${id}/complete`);
      fetchLesson();
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!lesson) {
    return <p className="text-slate-500">Lesson not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to={`/courses/${lesson.course.id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {lesson.course.title}
      </Link>

      <div className="card">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <BookOpen className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-brand-600">{lesson.course.title}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{lesson.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {lesson.durationMin} minutes
              </span>
              <span>Time spent: {lesson.totalTimeSpent} min</span>
              {lesson.completed && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed {lesson.completedAt && new Date(lesson.completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {lesson.description && (
          <p className="mt-6 text-slate-600 leading-relaxed">{lesson.description}</p>
        )}

        {!lesson.completed && (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="btn-primary mt-6"
          >
            {completing ? "Marking complete..." : "Mark as Complete"}
          </button>
        )}
      </div>

      {lesson.recentActivity.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Activity History</h2>
          <div className="divide-y divide-surface-border">
            {lesson.recentActivity.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium capitalize text-slate-700">{a.type.toLowerCase()}</p>
                  <p className="text-sm text-slate-500">{new Date(a.date).toLocaleString()}</p>
                </div>
                <span className="text-sm font-medium text-slate-600">{a.minutes} min</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
