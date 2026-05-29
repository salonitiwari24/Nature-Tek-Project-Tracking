import { MilestoneCategory, MilestoneStatus } from '../../mocks/milestoneMockData';

interface MilestoneStatusBadgeProps {
  type: 'status' | 'category' | 'health';
  value: MilestoneStatus | MilestoneCategory | 'ON_TRACK' | 'AT_RISK' | 'DELAYED';
}

export function MilestoneStatusBadge({ type, value }: MilestoneStatusBadgeProps) {
  if (type === 'status') {
    const status = value as MilestoneStatus;
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-250 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            Completed
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex rounded-full bg-rose-50 border border-rose-250 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 uppercase tracking-wider animate-pulse">
            Overdue
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-zinc-50 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Pending
          </span>
        );
    }
  }

  if (type === 'health') {
    const h = value as 'ON_TRACK' | 'AT_RISK' | 'DELAYED';
    switch (h) {
      case 'ON_TRACK':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            On Track
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 uppercase tracking-wider animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            At Risk
          </span>
        );
      case 'DELAYED':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
            Delayed
          </span>
        );
      default:
        return null;
    }
  }

  if (type === 'category') {
    const cat = value as MilestoneCategory;
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
      case 'HANDOVER':
        return (
          <span className="inline-flex rounded bg-fuchsia-50 border border-fuchsia-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-fuchsia-700">
            Handover
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-500">
            Gate
          </span>
        );
    }
  }

  return null;
}
