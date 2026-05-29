import { FileText, Eye, Download, Check, X } from 'lucide-react';
import { DocumentDetail } from '../../services/documentService';
import { DocumentStatusBadge } from './DocumentStatusBadge';

interface DocumentCardProps {
  document: DocumentDetail;
  onViewDetails: (doc: DocumentDetail) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function DocumentCard({ document, onViewDetails, onApprove, onReject }: DocumentCardProps) {
  const handleDownloadMock = () => {
    alert(`Initiating E2E encrypted download: ${document.name}. Safe download channel active.`);
  };

  return (
    <div className="relative flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-zinc-350">
      
      {/* Header ID & Status */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-bold text-zinc-400">{document.id}</span>
        <DocumentStatusBadge type="status" value={document.approvalStatus} />
      </div>

      {/* Doc Title */}
      <div className="mt-3 flex items-start gap-2 min-w-0">
        <FileText className="h-4.5 w-4.5 shrink-0 text-brand-650 mt-0.5" />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold text-zinc-950 line-clamp-2">
            <button type="button" onClick={() => onViewDetails(document)} className="hover:underline hover:text-brand-700 text-left">
              {document.name}
            </button>
          </h4>
        </div>
      </div>

      {/* Category & Mapped Stage */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        <DocumentStatusBadge type="category" value={document.category} />
        <span className="inline-flex items-center rounded-md bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 font-mono text-[8px] font-bold text-zinc-500 uppercase">
          {document.stage.replace(/_/g, ' ')}
        </span>
      </div>

      <hr className="my-3 border-zinc-150" />

      {/* Meta details */}
      <div className="space-y-1.5 text-xs text-zinc-600">
        <div className="truncate">
          Project: <strong className="text-zinc-800">{document.projectName}</strong>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-450">
          <span>Ver: <strong className="text-brand-650">{document.version}</strong></span>
          <span>Size: <strong className="text-zinc-700">{document.size}</strong></span>
        </div>
        <div className="text-[10px] text-zinc-400 mt-2">
          Uploaded by {document.uploadedBy} on {document.uploadedAt}
        </div>
      </div>

      {/* Action buttons footer */}
      <div className="flex items-center justify-between gap-1.5 mt-4 pt-3 border-t border-zinc-150 flex-wrap">
        
        {/* Approve/Reject triggers */}
        {document.approvalStatus === 'PENDING' ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onApprove(document.id)}
              className="inline-flex h-6 px-2 items-center justify-center gap-0.5 rounded border border-emerald-250 bg-emerald-50 text-[10px] font-extrabold text-emerald-700 hover:bg-emerald-100/50"
            >
              <Check className="h-3 w-3" />
              Approve
            </button>
            <button
              type="button"
              onClick={() => onReject(document.id)}
              className="inline-flex h-6 px-2 items-center justify-center gap-0.5 rounded border border-rose-250 bg-rose-50 text-[10px] font-extrabold text-rose-700 hover:bg-rose-100/50"
            >
              <X className="h-3 w-3" />
              Reject
            </button>
          </div>
        ) : (
          <div className="text-[10px] text-zinc-400 italic">Sign-off completed</div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={() => onViewDetails(document)}
            className="inline-flex h-7 px-2 items-center justify-center gap-1 rounded-md border border-zinc-200 bg-white text-xs font-semibold text-zinc-650 shadow-sm hover:border-zinc-300 hover:text-zinc-950"
          >
            <Eye className="h-3.5 w-3.5" />
            Detail
          </button>
          <button
            type="button"
            onClick={handleDownloadMock}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-550 shadow-sm hover:border-zinc-300 hover:text-zinc-900"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
