import { FileText, Download, Eye, FileSpreadsheet, Image } from 'lucide-react';
import { Document } from '../../mocks/projectMockData';

interface ProjectDocumentsProps {
  documents: Document[];
}

export function ProjectDocuments({ documents }: ProjectDocumentsProps) {
  const getFileIcon = (category: Document['category']) => {
    switch (category) {
      case 'SURVEY':
        return <FileSpreadsheet className="h-5 w-5 text-indigo-500 shrink-0" />;
      case 'DESIGN':
        return <FileText className="h-5 w-5 text-teal-500 shrink-0" />;
      case 'PHOTO':
        return <Image className="h-5 w-5 text-sky-500 shrink-0" />;
      default:
        return <FileText className="h-5 w-5 text-zinc-400 shrink-0" />;
    }
  };

  const getCategoryLabel = (category: Document['category']) => {
    switch (category) {
      case 'SURVEY':
        return 'Site Survey';
      case 'DESIGN':
        return 'CAD Drawings';
      case 'PERMIT':
        return 'Permit Clearance';
      case 'TEST':
        return 'QA Diagnostic';
      case 'HANDOVER':
        return 'Handover Docket';
      default:
        return 'Other Document';
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="border-b border-zinc-150 pb-4 mb-4">
        <h3 className="text-base font-bold text-zinc-950">Project Documents</h3>
        <p className="text-xs text-zinc-500">Drawings, certifications, and compliance logs</p>
      </div>

      <div className="space-y-2.5">
        {documents.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No document records linked to this project.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-zinc-150 p-3 hover:bg-zinc-50/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getFileIcon(doc.category)}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">{doc.title}</h4>
                  <p className="mt-0.5 text-[10px] text-zinc-400 font-semibold leading-none">
                    {doc.fileName} • {(doc.sizeKb / 1024).toFixed(1)} MB • {getCategoryLabel(doc.category)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  className="inline-flex h-7 w-7 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                  title="View Document"
                  onClick={() => alert(`Opening ${doc.fileName}... (Simulated)`)}
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                  className="inline-flex h-7 w-7 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                  title="Download File"
                  onClick={() => alert(`Downloading ${doc.fileName}... (Simulated)`)}
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
