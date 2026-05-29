import { useEffect, useState } from 'react';
import { Bell, List, Grid, CheckCheck } from 'lucide-react';
import { AlertDetail, AlertService, GetAlertsFilters } from '../services/alertService';
import { AlertFilterBar } from '../components/alerts/AlertFilterBar';
import { AlertTable } from '../components/alerts/AlertTable';
import { AlertCard } from '../components/alerts/AlertCard';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertDetail[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filters state
  const [filters, setFilters] = useState<GetAlertsFilters>({
    search: '',
    category: 'ALL',
    severity: 'ALL',
    readStatus: 'ALL',
    archivedStatus: 'ACTIVE',
    page: 1,
    limit: 10,
  });

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await AlertService.getAlerts(filters);
      setAlerts(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);

      const unread = await AlertService.getUnreadCount();
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to retrieve notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [filters]);

  const handleFilterChange = (name: keyof GetAlertsFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? (value as number) : 1,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'ALL',
      severity: 'ALL',
      readStatus: 'ALL',
      archivedStatus: 'ACTIVE',
      page: 1,
      limit: 10,
    });
  };

  const handleMarkRead = async (id: string) => {
    try {
      await AlertService.markAsRead(id);
      loadAlerts();
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await AlertService.archiveAlert(id);
      loadAlerts();
    } catch (err) {
      console.error('Failed to archive notification:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const activeUnread = alerts.filter((a) => !a.read);
      await Promise.all(activeUnread.map((a) => AlertService.markAsRead(a.id)));
      alert('All notifications on this view marked as read cleanly.');
      loadAlerts();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <Bell className="h-6 w-6 text-brand-600" />
            Alerts & Notifications Center
          </h1>
          <p className="text-sm text-zinc-500">
            Track delayed arrays, upcoming net-meter deadlines, safety warnings, and pending approvals
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-xs font-bold text-brand-700 hover:bg-brand-100/50 shadow-sm"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All as Read
            </button>
          )}

          <div className="flex items-center rounded-lg border border-zinc-200 p-1 bg-zinc-50 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex p-1 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-brand-650 shadow-xs'
                  : 'text-zinc-455 hover:bg-zinc-200/50 hover:text-zinc-800'
              }`}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex p-1 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-brand-650 shadow-xs'
                  : 'text-zinc-455 hover:bg-zinc-200/50 hover:text-zinc-800'
              }`}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC FILTERS BAR */}
      <AlertFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* ALERTS MAIN BOARD */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-1.5 shadow-sm overflow-hidden">
          {viewMode === 'list' ? (
            <AlertTable
              alerts={alerts}
              onMarkRead={handleMarkRead}
              onArchive={handleArchive}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
              {alerts.length === 0 ? (
                <div className="col-span-full py-12 text-center text-zinc-400 text-sm">
                  No notifications matched active filter queries.
                </div>
              ) : (
                alerts.map((a) => (
                  <AlertCard
                    key={a.id}
                    alert={a}
                    onMarkRead={handleMarkRead}
                    onArchive={handleArchive}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 flex-wrap gap-2.5">
          <span>
            Showing <strong className="text-zinc-800">{(filters.page! - 1) * filters.limit! + 1}</strong> to{' '}
            <strong className="text-zinc-800">
              {Math.min(filters.page! * filters.limit!, total)}
            </strong>{' '}
            of <strong className="text-zinc-800">{total}</strong> alerts ({unreadCount} unread)
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={filters.page === 1}
              onClick={() => handleFilterChange('page', filters.page! - 1)}
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 font-bold shadow-xs hover:bg-zinc-50 disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleFilterChange('page', p)}
                className={`rounded-md px-2.5 py-1.5 font-bold shadow-xs transition-colors ${
                  filters.page === p
                    ? 'bg-brand-600 text-white'
                    : 'border border-zinc-200 bg-white hover:bg-zinc-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={filters.page === totalPages}
              onClick={() => handleFilterChange('page', filters.page! + 1)}
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 font-bold shadow-xs hover:bg-zinc-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
