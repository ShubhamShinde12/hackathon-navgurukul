import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  color?: "indigo" | "emerald" | "amber" | "rose";
}

const colorMap = {
  indigo: "bg-brand-50 text-brand-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = "indigo" }: StatCardProps) {
  return (
    <div className="card transition hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          {trend && <p className="mt-2 text-xs font-medium text-emerald-600">{trend}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
