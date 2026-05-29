import { TaskStatus, TaskPriority, TaskCategory } from '../../mocks/taskMockData';

interface TaskStatusBadgeProps {
  type: 'status' | 'priority' | 'category';
  value: TaskStatus | TaskPriority | TaskCategory;
}

export function TaskStatusBadge({ type, value }: TaskStatusBadgeProps) {
  if (type === 'status') {
    const status = value as TaskStatus;
    switch (status) {
      case 'DONE':
        return (
          <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            Completed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider animate-pulse">
            In Progress
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex rounded-full bg-rose-50 border border-rose-250 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 uppercase tracking-wider">
            Blocked
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex rounded-full bg-amber-50 border border-amber-250 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
            In Review
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex rounded-full bg-zinc-100 border border-zinc-250 px-2.5 py-0.5 text-[10px] font-bold text-zinc-650 uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-zinc-50 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Not Started
          </span>
        );
    }
  }

  if (type === 'priority') {
    const priority = value as TaskPriority;
    switch (priority) {
      case 'URGENT':
        return (
          <span className="inline-flex rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-700">
            Urgent
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex rounded border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-orange-700">
            High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex rounded border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-sky-700">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-500">
            Low
          </span>
        );
    }
  }

  if (type === 'category') {
    const cat = value as TaskCategory;
    switch (cat) {
      case 'SURVEY':
        return (
          <span className="inline-flex rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-blue-700">
            Survey
          </span>
        );
      case 'DESIGN':
        return (
          <span className="inline-flex rounded bg-teal-50 border border-teal-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-teal-700">
            Design
          </span>
        );
      case 'PROCUREMENT':
        return (
          <span className="inline-flex rounded bg-violet-50 border border-violet-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-violet-700">
            Procurement
          </span>
        );
      case 'INSTALLATION':
        return (
          <span className="inline-flex rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">
            Installation
          </span>
        );
      case 'ELECTRICAL':
        return (
          <span className="inline-flex rounded bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-700">
            Electrical
          </span>
        );
      case 'TESTING':
        return (
          <span className="inline-flex rounded bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyan-700">
            Testing
          </span>
        );
      case 'DOCUMENTATION':
        return (
          <span className="inline-flex rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-700">
            Doc
          </span>
        );
      case 'APPROVAL':
        return (
          <span className="inline-flex rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
            Approval
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-500">
            Task
          </span>
        );
    }
  }

  return null;
}
