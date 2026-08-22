import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TimeSeriesPoint } from "../types";

interface TrendChartProps {
  data: TimeSeriesPoint[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Learning Time Trend</h3>
        <p className="text-sm text-slate-500">Daily minutes spent learning over the last 30 days</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "Minutes", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)",
              }}
              formatter={(value: number) => [`${value} min`, "Time spent"]}
            />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorMinutes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
