import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Approval } from '../../mocks/projectMockData';

interface ProjectApprovalsProps {
  approvals: Approval[];
  onApproveReject?: (id: string, action: 'APPROVED' | 'REJECTED') => void;
}

export function ProjectApprovals({ approvals, onApproveReject }: ProjectApprovalsProps) {
  const getStatusIcon = (status: Approval['status']) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-rose-500 shrink-0" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500 shrink-0 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: Approval['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-250';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border border-rose-250';
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-250';
    }
  };

  const getTypeLabel = (type: Approval['type']) => {
    switch (type) {
      case 'DESIGN':
        return 'Design Blueprint';
      case 'PROCUREMENT':
        return 'Procurement PO';
      case 'QA':
        return 'Quality Inspection';
      case 'HANDOVER':
        return 'Client Handover';
      case 'STAGE_GATE':
        return 'Lifecycle Gateway';
      case 'BUDGET':
        return 'Budget Revision';
      default:
        return type;
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="border-b border-zinc-150 pb-4 mb-4">
        <h3 className="text-base font-bold text-zinc-950">Approval Workflow</h3>
        <p className="text-xs text-zinc-500">Track and manage stage-gate sign-offs</p>
      </div>

      <div className="space-y-3">
        {approvals.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No approval logs listed for this project.</p>
        ) : (
          approvals.map((app) => (
            <div
              key={app.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-zinc-150 p-3.5 hover:bg-zinc-50/30 transition-all"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">{getStatusIcon(app.status)}</div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900">{app.title}</h4>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-400">
                    <span className="font-semibold text-zinc-500">{getTypeLabel(app.type)}</span>
                    <span>•</span>
                    <span>Requested by: {app.requestedBy}</span>
                    {app.actedAt && (
                      <>
                        <span>•</span>
                        <span>Date: {app.actedAt}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {app.status === 'PENDING' && onApproveReject ? (
                  <>
                    <button
                      onClick={() => onApproveReject(app.id, 'REJECTED')}
                      className="rounded bg-rose-50 border border-rose-200 px-2.5 py-1 text-[10px] font-bold text-rose-700 transition-colors hover:bg-rose-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onApproveReject(app.id, 'APPROVED')}
                      className="rounded bg-emerald-65 text-white px-2.5 py-1 text-[10px] font-bold transition-colors hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </>
                ) : (
                  <span className={`inline-flex rounded px-2 py-0.5 text-[9px] font-bold uppercase border ${getStatusBadge(app.status)}`}>
                    {app.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
