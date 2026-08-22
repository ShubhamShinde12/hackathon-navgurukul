import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CompletionChartProps {
  byCourse: { name: string; value: number; completed: number; total: number }[];
  completionStatus: { name: string; value: number; color: string }[];
}

const COURSE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export default function CompletionChart({ byCourse, completionStatus }: CompletionChartProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Completion by Course</h3>
          <p className="text-sm text-slate-500">Lessons completed per course</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byCourse}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {byCourse.map((_, i) => (
                  <Cell key={i} fill={COURSE_COLORS[i % COURSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(value: number, _name: string, props: { payload?: { name: string; completed: number; total: number } }) => {
                  const p = props.payload;
                  return [`${value} / ${p?.total ?? 0} lessons`, p?.name ?? ""];
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Overall Status</h3>
          <p className="text-sm text-slate-500">Completed vs remaining lessons</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={completionStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {completionStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
