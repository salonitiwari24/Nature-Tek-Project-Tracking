import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyCompletion } from '../../mocks/dashboardMockData';

interface MonthlyCompletionChartProps {
  data: MonthlyCompletion[];
  isLoading?: boolean;
}

export function MonthlyCompletionChart({ data, isLoading = false }: MonthlyCompletionChartProps) {
  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <span className="text-sm font-medium text-zinc-500">Generating timeline charts...</span>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-zinc-100 bg-white p-3 shadow-md">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{data.month}</p>
          <p className="mt-1 text-sm font-bold text-zinc-950">
            {data.completed} {data.completed === 1 ? 'Project' : 'Projects'} Completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900">Monthly Project Completions</h3>
        <p className="text-xs text-zinc-500">Completed grid connections per calendar month</p>
      </div>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-zinc-400">No completion data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#15803d" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis
                dataKey="month"
                stroke="#a1a1aa"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#a1a1aa"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f4f5', opacity: 0.5 }} />
              <Bar
                dataKey="completed"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
