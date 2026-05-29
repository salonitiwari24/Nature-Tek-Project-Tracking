import { AlertSeverity } from '../../mocks/alertMockData';

interface AlertSeverityBadgeProps {
  severity: AlertSeverity;
}

export function AlertSeverityBadge({ severity }: AlertSeverityBadgeProps) {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex rounded-full bg-rose-50 border border-rose-250 px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-rose-700 tracking-wider animate-pulse">
          Critical
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-flex rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-amber-700 tracking-wider">
          Warning
        </span>
      );
    default:
      return (
        <span className="inline-flex rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-blue-700 tracking-wider">
          Info
        </span>
      );
  }
}
