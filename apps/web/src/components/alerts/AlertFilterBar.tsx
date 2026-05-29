import { Search } from 'lucide-react';
import { GetAlertsFilters, AlertCategory, AlertSeverity } from '../../services/alertService';

const ALERT_CATEGORIES: { value: AlertCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Notification Categories' },
  { value: 'DELAYED_PROJECTS', label: 'Delayed Projects' },
  { value: 'DELAYED_TASKS', label: 'Delayed Tasks' },
  { value: 'OVERDUE_MILESTONES', label: 'Overdue Milestones' },
  { value: 'PENDING_APPROVALS', label: 'Pending Approvals' },
  { value: 'DOCUMENT_REJECTIONS', label: 'Document Rejections' },
  { value: 'UPCOMING_DEADLINES', label: 'Upcoming Deadlines' },
  { value: 'RESOURCE_ALLOCATION_WARNINGS', label: 'Resource Warnings' },
];

const SEVERITIES: { value: AlertSeverity | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Severities' },
  { value: 'INFO', label: 'Info' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'CRITICAL', label: 'Critical' },
];

interface AlertFilterBarProps {
  filters: GetAlertsFilters;
  onChange: (name: keyof GetAlertsFilters, value: string | number) => void;
  onClear: () => void;
}

export function AlertFilterBar({ filters, onChange, onClear }: AlertFilterBarProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
      {/* 1. Search Box */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
        <input
          type="text"
          placeholder="Search notifications by title scope, message parameters, project, or id..."
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          className="w-full rounded-lg border border-zinc-250 bg-white pl-9.5 pr-4 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
        />
      </div>

      <hr className="border-zinc-150" />

      {/* 2. Grid Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs">
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="font-bold text-zinc-500 uppercase tracking-wide block">Notification Category</label>
          <select
            value={filters.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full rounded border border-zinc-250 bg-white p-1.5 outline-none focus:border-brand-500 font-semibold"
          >
            {ALERT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="space-y-1">
          <label className="font-bold text-zinc-500 uppercase tracking-wide block">Severity Level</label>
          <select
            value={filters.severity}
            onChange={(e) => onChange('severity', e.target.value)}
            className="w-full rounded border border-zinc-250 bg-white p-1.5 outline-none focus:border-brand-500 font-semibold"
          >
            {SEVERITIES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Read Status Filter */}
        <div className="space-y-1">
          <label className="font-bold text-zinc-500 uppercase tracking-wide block">Read State</label>
          <select
            value={filters.readStatus}
            onChange={(e) => onChange('readStatus', e.target.value)}
            className="w-full rounded border border-zinc-250 bg-white p-1.5 outline-none focus:border-brand-500 font-semibold"
          >
            <option value="ALL">All Read/Unread</option>
            <option value="UNREAD">Unread Only</option>
            <option value="READ">Read Only</option>
          </select>
        </div>

        {/* Archived Status Filter */}
        <div className="space-y-1">
          <label className="font-bold text-zinc-500 uppercase tracking-wide block">Archive Status</label>
          <select
            value={filters.archivedStatus}
            onChange={(e) => onChange('archivedStatus', e.target.value)}
            className="w-full rounded border border-zinc-250 bg-white p-1.5 outline-none focus:border-brand-500 font-semibold"
          >
            <option value="ACTIVE">Active Notifications</option>
            <option value="ARCHIVED">Archived History</option>
            <option value="ALL">Active & Archived</option>
          </select>
        </div>
      </div>

      {/* Clear Shortcuts */}
      {(filters.search || filters.category !== 'ALL' || filters.severity !== 'ALL' || filters.readStatus !== 'ALL' || filters.archivedStatus !== 'ACTIVE') && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClear}
            className="text-[10px] font-extrabold text-brand-600 hover:text-brand-700 uppercase tracking-wider"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
