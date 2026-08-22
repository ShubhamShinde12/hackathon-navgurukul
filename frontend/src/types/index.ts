export type Role = "STUDENT" | "MENTOR";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface DashboardSummary {
  completedLessons: number;
  totalLessons: number;
  overallProgress: number;
  totalMinutes: number;
  totalHours: number;
  courseProgress: CourseProgress[];
  recentCompletions: RecentCompletion[];
}

export interface CourseProgress {
  courseId: string;
  title: string;
  completed: number;
  total: number;
  progressPercent: number;
}

export interface RecentCompletion {
  id: string;
  lessonTitle: string;
  courseTitle: string;
  completedAt: string;
}

export interface TimeSeriesPoint {
  date: string;
  minutes: number;
  hours: number;
}

export interface DistributionData {
  byCourse: { name: string; completed: number; pending: number; total: number; value: number }[];
  completionStatus: { name: string; value: number; color: string }[];
}

export interface Recommendation {
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  durationMin: number;
  reason: string;
}

export interface CourseListItem {
  id: string;
  title: string;
  description: string;
  category: string;
  lessonCount: number;
  completedCount: number;
  progressPercent: number;
}

export interface LessonItem {
  id: string;
  title: string;
  description: string | null;
  durationMin: number;
  order: number;
  completed: boolean;
  completedAt: string | null;
}

export interface CourseDetail extends CourseListItem {
  lessons: LessonItem[];
}

export interface MentorStudent {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  completedLessons: number;
  totalLessons: number;
  overallProgress: number;
  totalMinutes: number;
  totalHours: number;
  courseBreakdown: { title: string; completed: number; total: number }[];
}

export interface ActivityEvent {
  id: string;
  minutes: number;
  date: string;
  type: string;
  lesson?: { title: string; course: { title: string } } | null;
}
