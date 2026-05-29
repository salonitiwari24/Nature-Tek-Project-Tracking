import { FileText, Eye, Download, Check, X } from 'lucide-react';
import { DocumentDetail } from '../../services/documentService';
import { DocumentStatusBadge } from './DocumentStatusBadge';

interface DocumentTableProps {
  documents: DocumentDetail[];
  onViewDetails: (doc: DocumentDetail) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function DocumentTable({ documents, onViewDetails, onApprove, onReject }: DocumentTableProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDownloadMock = (docName: string) => {
    alert(`Initiating E2E encrypted download: ${docName}. File bundle fetched cleanly from Vault.`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="border-b border-zinc-250 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3.5">ID</th>
            <th className="px-4 py-3.5">Document Name</th>
            <th className="px-4 py-3.5">Category</th>
            <th className="px-4 py-3.5">Lifecycle Stage Mapping</th>
            <th className="px-4 py-3.5">Related Project</th>
            <th className="px-4 py-3.5 text-center">Version</th>
            <th className="px-4 py-3.5 text-center">Size</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {documents.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-12 text-center text-zinc-400">
                No documents found.
              </td>
            </tr>
          ) : (
            documents.map((d) => (
              <tr key={d.id} className="transition-colors hover:bg-zinc-50/50">
                {/* ID */}
                <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-zinc-450">
                  {d.id}
                </td>
                {/* Document Name */}
                <td className="px-4 py-4 max-w-[220px]">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-brand-600" />
                    <button
                      type="button"
                      onClick={() => onViewDetails(d)}
                      className="font-bold text-zinc-950 hover:text-brand-700 hover:underline transition-all truncate text-left"
                    >
                      {d.name}
                    </button>
                  </div>
                </td>
                {/* Category */}
                <td className="whitespace-nowrap px-4 py-4">
                  <DocumentStatusBadge type="category" value={d.category} />
                </td>
                {/* Lifecycle Stage Mapping */}
                <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-zinc-600">
                  <span className="inline-flex items-center rounded-md bg-zinc-50 border border-zinc-200 px-2 py-0.5 font-mono text-[10px] uppercase">
                    {d.stage.replace(/_/g, ' ')}
                  </span>
                </td>
                {/* Project context */}
                <td className="px-4 py-4 truncate max-w-[150px]">
                  <span className="font-semibold text-zinc-650">{d.projectName}</span>
                </td>
                {/* Version */}
                <td className="whitespace-nowrap px-4 py-4 text-center font-bold text-xs text-brand-650">
                  {d.version}
                </td>
                {/* Size */}
                <td className="whitespace-nowrap px-4 py-4 text-center font-semibold text-xs text-zinc-600">
                  {d.size}
                </td>
                {/* Status */}
                <td className="whitespace-nowrap px-4 py-4">
                  <DocumentStatusBadge type="status" value={d.approvalStatus} />
                </td>
                {/* Actions */}
                <td className="whitespace-nowrap px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => onViewDetails(d)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                      title="View Details History"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>

                    {/* Download */}
                    <button
                      type="button"
                      onClick={() => handleDownloadMock(d.name)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-550 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                      title="Download File"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>

                    {/* Approve / Reject Actions (Requirement 2) */}
                    {d.approvalStatus === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(d.id)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-emerald-250 bg-emerald-50 text-emerald-600 shadow-sm transition-colors hover:border-emerald-350 hover:bg-emerald-100/50"
                          title="Approve File"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(d.id)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-rose-250 bg-rose-50 text-rose-600 shadow-sm transition-colors hover:border-rose-350 hover:bg-rose-100/50"
                          title="Reject File"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
