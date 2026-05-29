import { AlertTriangle, Calendar, FileCheck, Clock } from 'lucide-react';
import { DashboardAlert } from '../../mocks/dashboardMockData';

interface DashboardAlertsProps {
  alerts: DashboardAlert[];
  isLoading?: boolean;
}

export function DashboardAlerts({ alerts, isLoading = false }: DashboardAlertsProps) {
  const delayedAlerts = alerts.filter((a) => a.type === 'DELAYED_PROJECT');
  const deadlineAlerts = alerts.filter((a) => a.type === 'UPCOMING_DEADLINE');
  const approvalAlerts = alerts.filter((a) => a.type === 'PENDING_APPROVAL');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSeverityStyle = (severity: DashboardAlert['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'low':
        return 'bg-zinc-50 text-zinc-600 border-zinc-150';
      default:
        return 'bg-zinc-50 text-zinc-600 border-zinc-150';
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="h-5 w-40 animate-pulse rounded bg-zinc-200 mb-4" />
        <div className="space-y-3">
          <div className="h-16 w-full animate-pulse rounded-lg bg-zinc-50" />
          <div className="h-16 w-full animate-pulse rounded-lg bg-zinc-50" />
        </div>
      </div>
    );
  }

  const AlertItem = ({ alert, icon, iconColor }: { alert: DashboardAlert; icon: React.ReactNode; iconColor: string }) => (
    <div
      key={alert.id}
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-zinc-50/50 ${getSeverityStyle(
        alert.severity
      )}`}
    >
      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white shadow-sm ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold font-mono tracking-wider">{alert.projectCode}</span>
          {alert.dueDate && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
              <Clock className="h-2.5 w-2.5" />
              {formatDate(alert.dueDate)}
            </span>
          )}
        </div>
        <h4 className="text-xs font-bold text-zinc-900 mt-0.5 truncate">{alert.title}</h4>
        <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{alert.description}</p>
        <span className="text-[10px] text-zinc-400 font-semibold block mt-1 leading-none">
          {alert.projectName}
        </span>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
          System Alerts
          {alerts.filter((a) => a.severity === 'high').length > 0 && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </h3>
        <p className="text-xs text-zinc-500">Critical items requiring direct oversight</p>
      </div>

      <div className="space-y-6">
        {/* Category: Delayed Projects */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Delayed Projects ({delayedAlerts.length})
            </span>
          </div>
          {delayedAlerts.length === 0 ? (
            <p className="text-xs text-zinc-400 italic pl-5">No delayed projects at present</p>
          ) : (
            <div className="space-y-2">
              {delayedAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  icon={<AlertTriangle className="h-4 w-4" />}
                  iconColor="text-red-500"
                />
              ))}
            </div>
          )}
        </div>

        {/* Category: Upcoming Deadlines */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Calendar className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Upcoming Milestones ({deadlineAlerts.length})
            </span>
          </div>
          {deadlineAlerts.length === 0 ? (
            <p className="text-xs text-zinc-400 italic pl-5">No pressing deadlines in the next 7 days</p>
          ) : (
            <div className="space-y-2">
              {deadlineAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  icon={<Calendar className="h-4 w-4" />}
                  iconColor="text-amber-500"
                />
              ))}
            </div>
          )}
        </div>

        {/* Category: Pending Approvals */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <FileCheck className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Pending Approvals ({approvalAlerts.length})
            </span>
          </div>
          {approvalAlerts.length === 0 ? (
            <p className="text-xs text-zinc-400 italic pl-5">All approval cycles up-to-date</p>
          ) : (
            <div className="space-y-2">
              {approvalAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  icon={<FileCheck className="h-4 w-4" />}
                  iconColor="text-indigo-500"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
