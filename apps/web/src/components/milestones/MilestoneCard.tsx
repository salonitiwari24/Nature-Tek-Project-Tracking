import { Link } from 'react-router-dom';
import { Calendar, Layers, Eye, Edit2, AlertCircle } from 'lucide-react';
import { MilestoneDetail, MilestoneService } from '../../services/milestoneService';
import { MilestoneStatusBadge } from './MilestoneStatusBadge';

interface MilestoneCardProps {
  milestone: MilestoneDetail;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const isOverdue = MilestoneService.isMilestoneOverdue(milestone);
  const delayDays = MilestoneService.calculateDelayDays(milestone);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`relative flex flex-col rounded-xl border p-4 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      isOverdue ? 'border-rose-350 ring-2 ring-rose-50/50' : 'border-zinc-200 hover:border-zinc-350'
    }`}>
      {/* Header ID & Status */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-bold text-zinc-400">{milestone.id}</span>
        <MilestoneStatusBadge type="status" value={milestone.status} />
      </div>

      {/* Title */}
      <h4 className="mt-3 text-sm font-extrabold text-zinc-950 line-clamp-2">
        <Link to={`/milestones/${milestone.id}`} className="hover:text-brand-700 hover:underline">
          {milestone.name}
        </Link>
      </h4>

      {/* Category & Stage */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        <MilestoneStatusBadge type="category" value={milestone.category} />
        <span className="inline-flex items-center rounded-md bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 font-mono text-[8px] font-bold text-zinc-500 uppercase">
          {milestone.stage.replace(/_/g, ' ')}
        </span>
      </div>

      <hr className="my-3 border-zinc-150" />

      {/* Related Project */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-600 min-w-0">
        <Layers className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
        <span className="truncate">
          Project:{' '}
          <Link to={`/projects/${milestone.projectId}`} className="font-bold text-zinc-800 hover:underline">
            {milestone.projectName}
          </Link>
        </span>
      </div>

      {/* Target Date */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-650 mt-2">
        <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
        <span>Target: <strong className="text-zinc-800">{formatDate(milestone.targetDate)}</strong></span>
      </div>

      {/* Overdue alert banner */}
      {isOverdue && (
        <span className="flex items-center gap-1 rounded bg-rose-50 border border-rose-100 px-2 py-1 text-[10px] font-bold text-rose-700 mt-3">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 animate-bounce" />
          Overdue by {delayDays} days
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5 mt-4 pt-3.5 border-t border-zinc-150">
        <Link
          to={`/milestones/${milestone.id}`}
          className="inline-flex h-7 px-2.5 items-center justify-center gap-1 rounded-md border border-zinc-200 bg-white text-xs font-bold text-zinc-600 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-950"
          title="Details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
        <Link
          to={`/milestones/${milestone.id}/edit`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-550 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
          title="Edit"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
