import { useState } from 'react';
import { X, FileText, UploadCloud, Calendar, History, PlusCircle, Check } from 'lucide-react';
import { DocumentDetail, DocumentService } from '../../services/documentService';
import { DocumentStatusBadge } from './DocumentStatusBadge';

interface DocumentViewerProps {
  document: DocumentDetail;
  onClose: () => void;
  onRefresh: () => void;
}

export function DocumentViewer({ document, onClose, onRefresh }: DocumentViewerProps) {
  const [newVersion, setNewVersion] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [editorName, setEditorName] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersion.trim() || !comments.trim() || !editorName.trim()) {
      alert('Please fill out all version revision parameters.');
      return;
    }

    setSubmitting(true);
    try {
      await DocumentService.addVersion(document.id, {
        version: newVersion.trim(),
        updatedBy: editorName.trim(),
        comments: comments.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNewVersion('');
        setComments('');
        setEditorName('');
        onRefresh();
      }, 1000);
    } catch (err) {
      console.error('Failed to append version revision:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl border-l border-zinc-200 animate-slide-in">
      {/* DRAWER HEADER */}
      <div className="flex items-center justify-between border-b border-zinc-200 p-4 bg-zinc-50">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-650" />
          <h3 className="font-extrabold text-zinc-950 text-sm">Vault File Inspector</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-250 hover:text-zinc-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* DRAWER CONTENT */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-zinc-650">
        {/* Core Metadata */}
        <div className="rounded-lg border border-zinc-200 p-4 bg-zinc-50/30 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-extrabold text-sm text-zinc-900 leading-tight break-all">{document.name}</h4>
            <DocumentStatusBadge type="status" value={document.approvalStatus} />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <DocumentStatusBadge type="category" value={document.category} />
            <span className="inline-flex items-center rounded-md bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 font-mono text-[8px] font-bold text-zinc-500 uppercase">
              {document.stage.replace(/_/g, ' ')}
            </span>
          </div>

          <hr className="border-zinc-150" />

          {/* Project Lifecycle Integration (Requirement 4) */}
          <div className="space-y-1.5 font-medium">
            <div>
              Project: <strong className="text-zinc-800">{document.projectName}</strong>
            </div>
            <div>
              Lifecycle Stage: <span className="font-mono bg-zinc-50 border px-1 rounded uppercase text-[9px]">{document.stage}</span>
            </div>
            <div className="flex justify-between">
              <span>Size: <strong className="text-zinc-850">{document.size}</strong></span>
              <span>Active Version: <strong className="text-brand-650">{document.version}</strong></span>
            </div>
          </div>
        </div>

        {/* PUSH A REVISION FORM */}
        <div className="rounded-lg border border-zinc-200 p-4 bg-white space-y-3.5 shadow-sm">
          <h5 className="font-extrabold text-zinc-950 flex items-center gap-1.5">
            <UploadCloud className="h-4 w-4 text-brand-650" />
            Push a File Revision
          </h5>

          {success ? (
            <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 flex items-center gap-2 font-bold animate-pulse">
              <Check className="h-4 w-4 text-emerald-600" />
              File Revision Pushed Cleanly!
            </div>
          ) : (
            <form onSubmit={handleAddVersion} className="space-y-3">
              <div>
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[8px] mb-1">New Revision Index *</label>
                <input
                  type="text"
                  placeholder="e.g. v1.2.0 or v2.0.0"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="w-full rounded border border-zinc-250 px-2 py-1.5 text-xs outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[8px] mb-1">Assigned Editor Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sunita Sharma"
                  value={editorName}
                  onChange={(e) => setEditorName(e.target.value)}
                  className="w-full rounded border border-zinc-250 px-2 py-1.5 text-xs outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[8px] mb-1">Revision Scope Notes *</label>
                <textarea
                  placeholder="Summarize exact corrections or layout syncs made..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={2}
                  className="w-full rounded border border-zinc-250 px-2 py-1.5 text-xs outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1.5 rounded bg-brand-600 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand-700 disabled:opacity-50"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                {submitting ? 'Pushing revision...' : 'Push Revision'}
              </button>
            </form>
          )}
        </div>

        {/* REVISION HISTORY TIMELINE */}
        <div className="space-y-3.5">
          <h5 className="font-extrabold text-zinc-950 flex items-center gap-1.5">
            <History className="h-4 w-4 text-brand-650" />
            Revision Audit Log ({document.versionHistory.length})
          </h5>

          <div className="relative border-l border-zinc-200 pl-4.5 ml-2.5 space-y-4">
            {document.versionHistory.map((item, index) => (
              <div key={index} className="relative">
                {/* Stepper node circle */}
                <div className="absolute -left-[24.5px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-650">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                </div>

                <div className="rounded-lg border border-zinc-150 p-2.5 bg-zinc-50/50">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-extrabold text-brand-700 text-[10px]">{item.version}</span>
                    <span className="text-[9px] text-zinc-400 font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.updatedAt}
                    </span>
                  </div>
                  <p className="font-semibold text-zinc-800 mt-1.5">{item.comments}</p>
                  <span className="block mt-1 text-[9px] text-zinc-450">Editor: <strong className="text-zinc-650 font-bold">{item.updatedBy}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
