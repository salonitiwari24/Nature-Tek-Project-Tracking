import { Check, Calendar } from 'lucide-react';
import { TaskDetail } from '../../services/taskService';

interface TaskTimelineProps {
  task: TaskDetail;
}

export function TaskTimeline({ task }: TaskTimelineProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const steps = [
    { title: 'Task Created', date: task.createdAt, isDone: true },
    { title: 'Crew Assigned', date: task.assignedDate, isDone: !!task.assignedDate },
    { title: 'Execution Started', date: task.startedDate, isDone: !!task.startedDate },
    { title: 'Task Completed', date: task.completedDate, isDone: !!task.completedDate },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="border-b border-zinc-150 pb-4 mb-4">
        <h3 className="text-base font-bold text-zinc-950">Audit Timeline</h3>
        <p className="text-xs text-zinc-500">Lifecycle trail of physical execution milestones</p>
      </div>

      <div className="relative pl-6 space-y-6 border-l border-zinc-150">
        {steps.map((step, idx) => {
          const isDone = step.isDone;
          const isActive = idx === steps.filter((s) => s.isDone).length - 1;

          return (
            <div key={idx} className="relative">
              {/* Bullet circle */}
              <div
                className={`absolute -left-[35px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] transition-colors ${
                  isDone
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white border-zinc-200 text-zinc-400 border-dashed'
                }`}
              >
                {isDone ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Title & Date */}
              <div className="min-w-0">
                <h4
                  className={`text-xs font-bold leading-none ${
                    isActive ? 'text-brand-700 font-extrabold text-sm' : isDone ? 'text-zinc-800' : 'text-zinc-400'
                  }`}
                >
                  {step.title}
                </h4>
                {step.date ? (
                  <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-zinc-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(step.date)}
                  </p>
                ) : (
                  <p className="mt-1 text-[10px] italic text-zinc-400">Awaiting previous phase gate</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
