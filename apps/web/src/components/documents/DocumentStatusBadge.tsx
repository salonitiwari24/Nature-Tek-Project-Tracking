import { DocCategory, DocApprovalStatus } from '../../mocks/documentMockData';

interface DocumentStatusBadgeProps {
  type: 'status' | 'category';
  value: DocApprovalStatus | DocCategory;
}

export function DocumentStatusBadge({ type, value }: DocumentStatusBadgeProps) {
  if (type === 'status') {
    const status = value as DocApprovalStatus;
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-250 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex rounded-full bg-rose-50 border border-rose-250 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 uppercase tracking-wider">
            Rejected
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

  if (type === 'category') {
    const cat = value as DocCategory;
    switch (cat) {
      case 'SURVEY_REPORTS':
        return (
          <span className="inline-flex rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-blue-700">
            Survey Report
          </span>
        );
      case 'DESIGN_DRAWINGS':
        return (
          <span className="inline-flex rounded bg-teal-50 border border-teal-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-teal-700">
            Design CAD
          </span>
        );
      case 'CUSTOMER_AGREEMENTS':
        return (
          <span className="inline-flex rounded bg-violet-50 border border-violet-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-violet-700">
            SLA / Charter
          </span>
        );
      case 'GOVERNMENT_APPROVALS':
        return (
          <span className="inline-flex rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
            Gov Approval
          </span>
        );
      case 'SAFETY_CHECKLISTS':
        return (
          <span className="inline-flex rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">
            Safety Checklist
          </span>
        );
      case 'INSTALLATION_REPORTS':
        return (
          <span className="inline-flex rounded bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-700">
            Install Report
          </span>
        );
      case 'COMPLETION_CERTIFICATES':
        return (
          <span className="inline-flex rounded bg-fuchsia-50 border border-fuchsia-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-fuchsia-700">
            Completion Cert
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-500">
            Document
          </span>
        );
    }
  }

  return null;
}
