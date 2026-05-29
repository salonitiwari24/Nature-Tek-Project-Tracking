import { Link } from 'react-router-dom';
import { Check, Archive, ExternalLink, Calendar } from 'lucide-react';
import { AlertDetail } from '../../mocks/alertMockData';
import { AlertSeverityBadge } from './AlertSeverityBadge';

interface AlertCardProps {
  alert: AlertDetail;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
}

export function AlertCard({ alert, onMarkRead, onArchive }: AlertCardProps) {
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
    <div className={`relative flex flex-col rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      !alert.read
        ? 'border-brand-300 bg-brand-50/5/10 ring-1 ring-brand-100'
        : 'border-zinc-200 bg-white'
    }`}>
      
      {/* Header Severity & Category */}
      <div className="flex items-center justify-between gap-2">
        <AlertSeverityBadge severity={alert.severity} />
        <span className="font-mono text-[9px] font-bold text-zinc-400 uppercase">
          {getCategoryLabel(alert.category)}
        </span>
      </div>

      {/* Unread Indicator Marker */}
      {!alert.read && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-600 border-2 border-white" />
      )}

      {/* Alert Title & Message */}
      <div className="mt-3 space-y-1.5 flex-1">
        <h4 className="text-xs font-black text-zinc-950 flex items-center gap-1.5 leading-snug">
          {alert.title}
          {alert.relatedId && getDeepRoute(alert) !== '#' && (
            <Link
              to={getDeepRoute(alert)}
              className="text-brand-600 hover:text-brand-700 transition-colors"
              title="Navigate to resource details page"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </h4>
        <p className="text-[11px] text-zinc-650 leading-relaxed leading-4">{alert.message}</p>
      </div>

      <hr className="my-3.5 border-zinc-150" />

      {/* Footer Meta & Actions */}
      <div className="flex items-center justify-between gap-2.5 text-[10px] text-zinc-500">
        
        {/* Project link and date */}
        <div className="min-w-0">
          {alert.projectName ? (
            <div className="truncate font-semibold text-zinc-700">
              Project: <Link to={`/projects/${alert.projectId}`} className="hover:underline hover:text-brand-700">{alert.projectName}</Link>
            </div>
          ) : (
            <div className="italic text-zinc-400">System Alert</div>
          )}
          <div className="flex items-center gap-1 mt-1 text-[9px] text-zinc-400 font-mono">
            <Calendar className="h-3 w-3" />
            {alert.createdAt}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          {!alert.read && (
            <button
              type="button"
              onClick={() => onMarkRead(alert.id)}
              className="inline-flex h-7 px-2.5 items-center justify-center gap-0.5 rounded-md border border-brand-200 bg-brand-50 text-[10px] font-extrabold text-brand-700 hover:bg-brand-100/50"
            >
              <Check className="h-3.5 w-3.5" />
              Read
            </button>
          )}
          <button
            type="button"
            onClick={() => onArchive(alert.id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-550 shadow-xs hover:border-zinc-350 hover:text-zinc-950"
            title="Archive"
          >
            <Archive className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
