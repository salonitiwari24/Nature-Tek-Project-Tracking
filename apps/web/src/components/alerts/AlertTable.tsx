import { Link } from 'react-router-dom';
import { Check, Archive, ExternalLink } from 'lucide-react';
import { AlertDetail } from '../../mocks/alertMockData';
import { AlertSeverityBadge } from './AlertSeverityBadge';

interface AlertTableProps {
  alerts: AlertDetail[];
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
}

export function AlertTable({ alerts, onMarkRead, onArchive }: AlertTableProps) {
  const getCategoryLabel = (cat: string) => {
    return cat.replace(/_/g, ' ');
  };

  const getDeepRoute = (alert: AlertDetail) => {
    if (!alert.relatedId) return '#';
    switch (alert.category) {
      case 'DELAYED_PROJECTS':
        return `/projects/${alert.projectId}`;
      case 'DELAYED_TASKS':
        return `/tasks/${alert.relatedId}`;
      case 'OVERDUE_MILESTONES':
        return `/milestones/${alert.relatedId}`;
      case 'PENDING_APPROVALS':
      case 'DOCUMENT_REJECTIONS':
        return `/documents`;
      default:
        return '#';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-zinc-250 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="w-8 px-4 py-3.5"></th>
            <th className="px-4 py-3.5">Severity</th>
            <th className="px-4 py-3.5">Alert Details</th>
            <th className="px-4 py-3.5">Category</th>
            <th className="px-4 py-3.5">Project Mapping</th>
            <th className="px-4 py-3.5">Timestamp</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {alerts.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                No active notifications found.
              </td>
            </tr>
          ) : (
            alerts.map((a) => (
              <tr
                key={a.id}
                className={`transition-colors hover:bg-zinc-50/50 ${
                  !a.read ? 'bg-zinc-50/20 font-medium' : ''
                }`}
              >
                {/* 1. Status Indicator (Unread dot) */}
                <td className="px-4 py-4 text-center">
                  {!a.read && (
                    <span className="inline-block h-2 w-2 rounded-full bg-brand-650 ring-4 ring-brand-50" title="Unread notification" />
                  )}
                </td>

                {/* 2. Severity */}
                <td className="whitespace-nowrap px-4 py-4">
                  <AlertSeverityBadge severity={a.severity} />
                </td>

                {/* 3. Details */}
                <td className="px-4 py-4 max-w-sm">
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-zinc-950 text-xs flex items-center gap-1">
                      {a.title}
                      {a.relatedId && getDeepRoute(a) !== '#' && (
                        <Link to={getDeepRoute(a)} className="text-brand-600 hover:text-brand-700">
                          <ExternalLink className="h-3 w-3 inline" />
                        </Link>
                      )}
                    </h5>
                    <p className="text-[11px] text-zinc-650 leading-relaxed leading-4">{a.message}</p>
                  </div>
                </td>

                {/* 4. Category */}
                <td className="whitespace-nowrap px-4 py-4 text-[10px] uppercase font-mono font-bold text-zinc-500">
                  {getCategoryLabel(a.category)}
                </td>

                {/* 5. Project Mapping */}
                <td className="px-4 py-4 truncate max-w-[150px] text-xs font-semibold text-zinc-700">
                  {a.projectName ? (
                    <Link to={`/projects/${a.projectId}`} className="hover:underline hover:text-brand-700">
                      {a.projectName}
                    </Link>
                  ) : (
                    <span className="text-zinc-400 italic">System Wide</span>
                  )}
                </td>

                {/* 6. Timestamp */}
                <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-zinc-450 font-mono">
                  {a.createdAt}
                </td>

                {/* 7. Actions */}
                <td className="whitespace-nowrap px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {!a.read && (
                      <button
                        type="button"
                        onClick={() => onMarkRead(a.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-200 bg-brand-50 text-brand-650 shadow-xs transition-colors hover:bg-brand-100/50"
                        title="Mark as Read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onArchive(a.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-xs transition-colors hover:border-zinc-350 hover:text-zinc-950"
                      title="Archive Alert"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
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
