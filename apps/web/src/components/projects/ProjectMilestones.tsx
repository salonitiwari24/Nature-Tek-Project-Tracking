import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Milestone } from '../../mocks/projectMockData';

interface ProjectMilestonesProps {
  milestones: Milestone[];
}

export function ProjectMilestones({ milestones }: ProjectMilestonesProps) {
  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-indigo-500 shrink-0 animate-pulse" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />;
      default:
        return <Clock className="h-4 w-4 text-zinc-300 shrink-0" />;
    }
  };

  const getStatusBadgeClass = (status: Milestone['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_PROGRESS':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'OVERDUE':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-zinc-50 text-zinc-500 border-zinc-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="border-b border-zinc-150 pb-4 mb-4">
        <h3 className="text-base font-bold text-zinc-950">Project Milestones</h3>
        <p className="text-xs text-zinc-500">Key engineering phase deadlines</p>
      </div>

      <div className="space-y-3">
        {milestones.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No milestones defined for this project.</p>
        ) : (
          milestones.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-zinc-50/50 ${
                m.status === 'OVERDUE' ? 'border-red-200 bg-red-50/10' : 'border-zinc-150'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">{getStatusIcon(m.status)}</div>
                <div className="min-w-0">
                  <h4 className={`text-xs font-bold text-zinc-900 truncate`}>{m.name}</h4>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 shrink-0" />
                      Target: {formatDate(m.targetDate)}
                    </span>
                    {m.completionDate && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        Completed: {formatDate(m.completionDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold border uppercase ${getStatusBadgeClass(m.status)}`}>
                {m.status === 'OVERDUE' ? 'Overdue' : m.status === 'IN_PROGRESS' ? 'In Progress' : m.status.toLowerCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
