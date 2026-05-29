import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusDistributionItem {
  name: string;
  value: number;
  color: string;
}

interface ProjectStatusChartProps {
  data: StatusDistributionItem[];
  isLoading?: boolean;
}

export function ProjectStatusChart({ data, isLoading = false }: ProjectStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <span className="text-sm font-medium text-zinc-500">Generating status breakdown...</span>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(0) : '0';
      return (
        <div className="rounded-lg border border-zinc-100 bg-white p-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="text-sm font-semibold text-zinc-950">{data.name}</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {data.value} {data.value === 1 ? 'project' : 'projects'} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-zinc-900">Project Status Distribution</h3>
        <p className="text-xs text-zinc-500">Breakdown of portfolio lifecycle state</p>
      </div>

      <div className="relative h-64 w-full">
        {total === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-zinc-400">No active projects to display</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-zinc-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
        {total > 0 && (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex flex-col items-center justify-center pb-8">
            <span className="text-2xl font-bold text-zinc-950">{total}</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">Total</span>
          </div>
        )}
      </div>
    </div>
  );
}
