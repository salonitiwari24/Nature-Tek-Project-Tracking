import { useState } from 'react';
import { Briefcase, Activity, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboard';
import { KPICard } from '../components/dashboard/KPICard';
import { ProjectStatusChart } from '../components/dashboard/ProjectStatusChart';
import { MonthlyCompletionChart } from '../components/dashboard/MonthlyCompletionChart';
import { RecentProjectsTable } from '../components/dashboard/RecentProjectsTable';
import { SolarWorkflowProgressWidget } from '../components/dashboard/SolarWorkflowProgressWidget';
import { DashboardAlerts } from '../components/dashboard/DashboardAlerts';
import { mockProjects } from '../mocks/dashboardMockData';

export function DashboardPage() {
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('ALL');

  const {
    stats,
    recentProjects,
    monthlyCompletions,
    statusDistribution,
    alerts,
    isLoading,
    error,
    refetch,
  } = useDashboardData(projectTypeFilter);

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Solar Operations Dashboard</h1>
          <p className="text-sm text-zinc-500">Nature Tek Solar Portfolio & Installations Overview</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Lightweight Filter Control */}
          <div className="flex rounded-lg border border-zinc-200 bg-white p-1 shadow-sm">
            {['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'].map((type) => (
              <button
                key={type}
                onClick={() => setProjectTypeFilter(type)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                  projectTypeFilter === type
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {type === 'ALL' ? 'All Portfolios' : type}
              </button>
            ))}
          </div>

          <button
            onClick={() => refetch()}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm transition-colors"
            title="Refresh Dashboard Data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Sync Error</p>
              <p className="mt-0.5 text-xs text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Projects"
          value={stats?.totalProjects ?? 0}
          icon={<Briefcase className="h-5 w-5" />}
          trend={stats?.totalProjectsTrend}
          isLoading={isLoading}
        />
        <KPICard
          title="Active Projects"
          value={stats?.activeProjects ?? 0}
          icon={<Activity className="h-5 w-5" />}
          trend={stats?.activeProjectsTrend}
          isLoading={isLoading}
        />
        <KPICard
          title="Completed Grid"
          value={stats?.completedProjects ?? 0}
          icon={<CheckCircle2 className="h-5 w-5" />}
          trend={stats?.completedProjectsTrend}
          isLoading={isLoading}
        />
        <KPICard
          title="Delayed Stages"
          value={stats?.delayedProjects ?? 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={stats?.delayedProjectsTrend}
          isLoading={isLoading}
        />
      </div>

      {/* Stepper Widget (spanning full width) */}
      <SolarWorkflowProgressWidget projects={mockProjects} isLoading={isLoading} />

      {/* Charts & Alerts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Charts (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectStatusChart data={statusDistribution} isLoading={isLoading} />
            <MonthlyCompletionChart data={monthlyCompletions} isLoading={isLoading} />
          </div>

          {/* Recent Projects Table */}
          <RecentProjectsTable projects={recentProjects} isLoading={isLoading} />
        </div>

        {/* Right Column: Dynamic Actionable Alerts */}
        <div className="lg:col-span-1">
          <DashboardAlerts alerts={alerts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
