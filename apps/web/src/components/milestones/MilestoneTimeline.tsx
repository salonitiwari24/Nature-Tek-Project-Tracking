import { Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MilestoneDetail, MilestoneService } from '../../services/milestoneService';
import { MilestoneStatusBadge } from './MilestoneStatusBadge';

interface MilestoneTimelineProps {
  milestone: MilestoneDetail;
}

export function MilestoneTimeline({ milestone }: MilestoneTimelineProps) {
  const isOverdue = MilestoneService.isMilestoneOverdue(milestone);
  const delayDays = MilestoneService.calculateDelayDays(milestone);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Pending Gate';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      <div className="border-b border-zinc-150 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-zinc-950">Timeline Metrics</h3>
        <MilestoneStatusBadge type="status" value={milestone.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Target Date */}
        <div className="rounded-lg border border-zinc-150 p-3 bg-zinc-50/50">
          <span className="block text-zinc-400 font-bold uppercase tracking-wide text-[9px] mb-1">Target Completion Date</span>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <span className="font-bold text-zinc-800 text-sm">{formatDate(milestone.targetDate)}</span>
          </div>
        </div>

        {/* Completion Date */}
        <div className={`rounded-lg border p-3 ${
          milestone.status === 'COMPLETED'
            ? 'border-emerald-100 bg-emerald-50/20 text-emerald-800'
            : 'border-zinc-150 bg-zinc-50/50'
        }`}>
          <span className="block text-zinc-400 font-bold uppercase tracking-wide text-[9px] mb-1">Actual Completion Date</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`h-4 w-4 ${milestone.status === 'COMPLETED' ? 'text-emerald-600' : 'text-zinc-450'}`} />
            <span className={`font-bold text-sm ${milestone.status === 'COMPLETED' ? 'text-emerald-700' : 'text-zinc-500'}`}>
              {milestone.completedAt ? formatDate(milestone.completedAt) : 'Awaiting physical sign-off'}
            </span>
          </div>
        </div>

        {/* Delay days info */}
        {delayDays > 0 && (
          <div className="sm:col-span-2 rounded-lg border border-rose-200 bg-rose-50/30 p-3 text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-rose-600 animate-pulse mt-0.5" />
            <div className="text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[9px] text-rose-700">Chronological Delay Detected</span>
              <p className="font-medium text-rose-750 mt-0.5">
                This project gate has exceeded its specified timeline parameters by{' '}
                <strong className="font-extrabold text-sm">{delayDays} days</strong> against simulated boundary. Coordinate
                material flows or structures installers immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
