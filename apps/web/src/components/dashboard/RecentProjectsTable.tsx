import { LIFECYCLE_STAGES, LIFECYCLE_STAGE_LABELS } from '@nature-tek/shared';
import { Project } from '../../mocks/dashboardMockData';

interface RecentProjectsTableProps {
  projects: Project[];
  isLoading?: boolean;
}

export function RecentProjectsTable({ projects, isLoading = false }: RecentProjectsTableProps) {
  const getProgressPercentage = (stage: Project['currentStage']) => {
    const index = LIFECYCLE_STAGES.indexOf(stage);
    if (index < 0) return 0;
    return Math.round((index / (LIFECYCLE_STAGES.length - 1)) * 100);
  };

  const getStatusStyle = (status: Project['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'COMPLETED':
        return 'bg-brand-50 text-brand-700 border border-brand-200';
      case 'ON_HOLD':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'ARCHIVED':
        return 'bg-zinc-150 text-zinc-600 border border-zinc-200';
      default:
        return 'bg-zinc-50 text-zinc-600 border border-zinc-200';
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-150 px-5 py-4">
          <div className="h-5 w-36 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="p-5">
          <div className="space-y-4">
            <div className="h-6 w-full animate-pulse rounded bg-zinc-100" />
            <div className="h-10 w-full animate-pulse rounded bg-zinc-50" />
            <div className="h-10 w-full animate-pulse rounded bg-zinc-50" />
            <div className="h-10 w-full animate-pulse rounded bg-zinc-50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h3 className="text-base font-semibold text-zinc-900">Recent Projects</h3>
        <p className="text-xs text-zinc-500">Latest active and completed solar arrays</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-zinc-250 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-5 py-3.5">Project ID</th>
              <th className="px-5 py-3.5">Project Name</th>
              <th className="px-5 py-3.5">Location</th>
              <th className="px-5 py-3.5">Capacity</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-zinc-400">
                  No projects found for current filter
                </td>
              </tr>
            ) : (
              projects.map((p) => {
                const progress = getProgressPercentage(p.currentStage);
                return (
                  <tr key={p.id} className="transition-colors hover:bg-zinc-50/55">
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-semibold text-zinc-600">
                      {p.code}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-zinc-900">{p.name}</div>
                      <div className="text-xs text-zinc-500">{p.clientName}</div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600">
                      {p.siteCity}, {p.siteState}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-zinc-900">
                      {p.capacityKw >= 1000
                        ? `${(p.capacityKw / 1000).toFixed(1)} MW`
                        : `${p.capacityKw} kW`}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              p.status === 'COMPLETED'
                                ? 'bg-brand-500'
                                : p.status === 'ON_HOLD'
                                  ? 'bg-amber-400'
                                  : 'bg-indigo-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-zinc-700">{progress}%</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium leading-none mt-0.5 block">
                        {LIFECYCLE_STAGE_LABELS[p.currentStage]}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
