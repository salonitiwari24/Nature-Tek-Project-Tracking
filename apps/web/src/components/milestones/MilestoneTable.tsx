import { Link } from 'react-router-dom';
import { Eye, Edit2, AlertCircle } from 'lucide-react';
import { MilestoneDetail, MilestoneService } from '../../services/milestoneService';
import { MilestoneStatusBadge } from './MilestoneStatusBadge';

interface MilestoneTableProps {
  milestones: MilestoneDetail[];
}

export function MilestoneTable({ milestones }: MilestoneTableProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="border-b border-zinc-250 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3.5">ID</th>
            <th className="px-4 py-3.5">Milestone Name</th>
            <th className="px-4 py-3.5">Category</th>
            <th className="px-4 py-3.5">Lifecycle Stage</th>
            <th className="px-4 py-3.5">Related Project</th>
            <th className="px-4 py-3.5">Target Date</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-center">Delay</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {milestones.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-12 text-center text-zinc-400">
                No milestones matched search criteria or filters.
              </td>
            </tr>
          ) : (
            milestones.map((m) => {
              const isOverdue = MilestoneService.isMilestoneOverdue(m);
              const delayDays = MilestoneService.calculateDelayDays(m);

              return (
                <tr
                  key={m.id}
                  className={`transition-colors hover:bg-zinc-50/50 ${
                    isOverdue ? 'bg-rose-50/20' : ''
                  }`}
                >
                  {/* ID */}
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-zinc-650">
                    {m.id}
                  </td>
                  {/* Milestone Name */}
                  <td className="px-4 py-4 min-w-[200px]">
                    <div className="flex flex-col">
                      <Link
                        to={`/milestones/${m.id}`}
                        className="font-bold text-zinc-950 hover:text-brand-700 hover:underline transition-all"
                      >
                        {m.name}
                      </Link>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-650 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0 animate-bounce" />
                          Target Date Exceeded by {delayDays} days
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Category */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <MilestoneStatusBadge type="category" value={m.category} />
                  </td>
                  {/* Lifecycle Stage Mapping */}
                  <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-zinc-600">
                    <span className="inline-flex items-center rounded-md bg-zinc-50 border border-zinc-200 px-2 py-0.5 font-mono text-[10px] uppercase">
                      {m.stage.replace(/_/g, ' ')}
                    </span>
                  </td>
                  {/* Project Context */}
                  <td className="px-4 py-4 max-w-[150px] truncate">
                    <Link
                      to={`/projects/${m.projectId}`}
                      className="font-semibold text-zinc-650 hover:text-brand-700 hover:underline"
                    >
                      {m.projectName}
                    </Link>
                  </td>
                  {/* Target Date */}
                  <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-zinc-700">
                    {formatDate(m.targetDate)}
                  </td>
                  {/* Status */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <MilestoneStatusBadge type="status" value={m.status} />
                  </td>
                  {/* Delay */}
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    {delayDays > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-xs font-bold text-rose-700">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {delayDays}d
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 font-medium">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/milestones/${m.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        to={`/milestones/${m.id}/edit`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                        title="Edit Milestone"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
