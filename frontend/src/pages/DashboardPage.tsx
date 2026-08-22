import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { BookOpen, Clock, Target, TrendingUp } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import TrendChart from "../components/TrendChart";
import CompletionChart from "../components/CompletionChart";
import CourseProgressList, { RecommendationList } from "../components/CourseProgressList";
import type {
  DashboardSummary,
  TimeSeriesPoint,
  DistributionData,
  Recommendation,
} from "../types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [timeseries, setTimeseries] = useState<TimeSeriesPoint[]>([]);
  const [distribution, setDistribution] = useState<DistributionData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "MENTOR") return;

    Promise.all([
      api.get("/dashboard/summary"),
      api.get("/dashboard/timeseries"),
      api.get("/dashboard/distribution"),
      api.get("/dashboard/recommendations"),
    ])
      .then(([s, t, d, r]) => {
        setSummary(s.data);
        setTimeseries(t.data);
        setDistribution(d.data);
        setRecommendations(r.data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role === "MENTOR") {
    return <Navigate to="/mentor" replace />;
  }

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
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-slate-500">Here&apos;s an overview of your learning progress</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Lessons Completed"
          value={summary?.completedLessons ?? 0}
          subtitle={`of ${summary?.totalLessons ?? 0} total`}
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Time Spent"
          value={`${summary?.totalHours ?? 0}h`}
          subtitle={`${summary?.totalMinutes ?? 0} minutes total`}
          icon={Clock}
          color="emerald"
        />
        <StatCard
          title="Overall Progress"
          value={`${summary?.overallProgress ?? 0}%`}
          subtitle="Across all courses"
          icon={Target}
          color="amber"
        />
        <StatCard
          title="Active Courses"
          value={summary?.courseProgress.filter((c) => c.completed > 0).length ?? 0}
          subtitle="Courses in progress"
          icon={TrendingUp}
          color="rose"
        />
      </div>

      <TrendChart data={timeseries} />

      {distribution && (
        <CompletionChart
          byCourse={distribution.byCourse}
          completionStatus={distribution.completionStatus}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <CourseProgressList courses={summary?.courseProgress ?? []} />
        <RecommendationList recommendations={recommendations} />
      </div>

      {summary && summary.recentCompletions.length > 0 && (
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Recently Completed</h3>
          <div className="divide-y divide-surface-border">
            {summary.recentCompletions.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium text-slate-800">{item.lessonTitle}</p>
                  <p className="text-sm text-slate-500">{item.courseTitle}</p>
                </div>
                <span className="text-sm text-slate-400">
                  {new Date(item.completedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
