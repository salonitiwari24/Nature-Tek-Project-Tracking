import { Link } from 'react-router-dom';
import { Calendar, User, Settings, AlertTriangle } from 'lucide-react';
import { TaskDetail, TaskService } from '../../services/taskService';
import { TaskStatusBadge } from './TaskStatusBadge';

interface TaskCardProps {
  task: TaskDetail;
}

export function TaskCard({ task }: TaskCardProps) {
  const isOverdue = TaskService.isOverdue(task);
  const isDueSoon = TaskService.isDueSoon(task);
  const delayDays = TaskService.calculateDelayDays(task);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`relative flex flex-col rounded-xl border p-4 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      isOverdue ? 'border-rose-300 ring-2 ring-rose-50/50' : 'border-zinc-200 hover:border-zinc-300'
    }`}>
      {/* Header Badges */}
      <div className="flex items-center justify-between gap-2.5">
        <span className="font-mono text-[10px] font-bold text-zinc-400">{task.id}</span>
        <div className="flex items-center gap-1.5">
          <TaskStatusBadge type="category" value={task.category} />
          <TaskStatusBadge type="priority" value={task.priority} />
        </div>
      </div>

      {/* Task Title */}
      <h4 className="mt-2.5 text-sm font-bold text-zinc-950 line-clamp-2">
        <Link to={`/tasks/${task.id}`} className="hover:text-brand-700 hover:underline">
          {task.title}
        </Link>
      </h4>
      
      {/* Project Context */}
      <p className="text-[11px] text-zinc-400 font-semibold mt-1">
        Project: <Link to={`/projects/${task.projectId}`} className="text-zinc-650 hover:underline">{task.projectName}</Link>
      </p>

      {/* Divider */}
      <hr className="my-3 border-zinc-150" />

      {/* Assignee & Dates */}
      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
        <div className="flex items-center gap-1.5 min-w-0">
          <User className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="truncate">{task.assigneeName || 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0 justify-end">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="truncate font-semibold">{formatDate(task.dueDate)}</span>
        </div>
      </div>

      {/* Progress & Deadlines Warnings */}
      <div className="mt-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500">
          <TaskStatusBadge type="status" value={task.status} />
          <span>{task.progress}%</span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              task.status === 'DONE'
                ? 'bg-brand-500'
                : task.status === 'BLOCKED'
                  ? 'bg-red-500'
                  : 'bg-indigo-500'
            }`}
            style={{ width: `${task.progress}%` }}
          />
        </div>

        {/* Due soon / Overdue banner */}
        {isOverdue && (
          <span className="flex items-center gap-1 rounded bg-rose-50 border border-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 mt-2">
            <AlertTriangle className="h-3 w-3 shrink-0 animate-bounce" />
            Overdue by {delayDays} days
          </span>
        )}

        {isDueSoon && (
          <span className="flex items-center gap-1 rounded bg-amber-50 border border-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 mt-2">
            <AlertTriangle className="h-3 w-3 shrink-0 animate-pulse" />
            Due soon (within 3d)
          </span>
        )}
      </div>
    </div>
  );
}
