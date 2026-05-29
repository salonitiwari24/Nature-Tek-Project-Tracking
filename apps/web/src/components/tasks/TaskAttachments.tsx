import { Download, File, Paperclip } from 'lucide-react';
import { TaskAttachment } from '../../mocks/taskMockData';

interface TaskAttachmentsProps {
  attachments: TaskAttachment[];
}

export function TaskAttachments({ attachments }: TaskAttachmentsProps) {
  const formatSize = (kb: number) => {
    if (kb >= 1024) {
      return `${(kb / 1024).toFixed(1)} MB`;
    }
    return `${kb} KB`;
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      <div className="border-b border-zinc-150 pb-4">
        <h3 className="text-base font-bold text-zinc-950">Task Attachments</h3>
        <p className="text-xs text-zinc-500">Related survey drafts, design SLDs, and reports</p>
      </div>

      <div className="space-y-2">
        {attachments.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No attachments uploaded for this task.</p>
        ) : (
          attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-zinc-150 p-2.5 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-250 text-zinc-650">
                  <File className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-xs">
                  <h4 className="font-bold text-zinc-800 truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                    {formatSize(file.sizeKb)} • Uploaded {file.uploadedAt}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Downloading mock attachment: ${file.name}`)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-350 hover:text-zinc-950"
                title="Download Attachment"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <hr className="border-zinc-150" />

      {/* Upload button wrapper */}
      <button
        type="button"
        onClick={() => alert('Attachments upload is mocked in this view.')}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-300 px-4 py-2.5 text-xs font-bold text-zinc-550 transition-colors hover:border-brand-350 hover:bg-brand-50/10 hover:text-brand-700"
      >
        <Paperclip className="h-4 w-4" />
        Upload Document
      </button>
    </div>
  );
}
