import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, List, Grid, Layers, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { MilestoneDetail, MilestoneService, GetMilestonesFilters } from '../services/milestoneService';
import { ProjectService } from '../services/projectService';
import { MilestoneTable } from '../components/milestones/MilestoneTable';
import { MilestoneCard } from '../components/milestones/MilestoneCard';

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<MilestoneDetail[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [filters, setFilters] = useState<GetMilestonesFilters>({
    search: '',
    projectId: 'ALL',
    status: 'ALL',
    category: 'ALL',
    page: 1,
    limit: 10,
  });

  const [projectsList, setProjectsList] = useState<{ id: string; name: string }[]>([]);

  // KPI Metrics counts
  const [kpis, setKpis] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  });

  useEffect(() => {
    const loadProjectsFilter = async () => {
      try {
        const response = await ProjectService.getProjects({ limit: 100 });
        setProjectsList(response.data.map((p) => ({ id: p.id, name: p.name })));
      } catch (err) {
        console.error('Failed to load filter projects:', err);
      }
    };
    loadProjectsFilter();
  }, []);

  useEffect(() => {
    const fetchMilestonesData = async () => {
      setLoading(true);
      try {
        const result = await MilestoneService.getMilestones(filters);
        setMilestones(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);

        // Load all milestones unfiltered to compute global KPI stats (Requirement 2)
        const allResult = await MilestoneService.getMilestones({ limit: 1000 });
        const allData = allResult.data;

        setKpis({
          total: allData.length,
          completed: allData.filter((m) => m.status === 'COMPLETED').length,
          inProgress: allData.filter((m) => m.status === 'IN_PROGRESS' || m.status === 'PENDING').length,
          overdue: allData.filter((m) => m.status === 'OVERDUE' || MilestoneService.isMilestoneOverdue(m)).length,
        });

      } catch (err) {
        console.error('Failed to load milestones registry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMilestonesData();
  }, [filters]);

  const handleFilterChange = (name: keyof GetMilestonesFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? (value as number) : 1,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      projectId: 'ALL',
      status: 'ALL',
      category: 'ALL',
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Milestone Management Ledger</h1>
          <p className="text-sm text-zinc-500">Track critical project gates, lifecycle stages mapping, and cascade validation checks</p>
        </div>
        <Link
          to="/milestones/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Add Milestone
        </Link>
      </div>

      {/* KPI METRIC CARDS (Requirement 2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-500">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Total Milestones</span>
            <span className="text-xl font-extrabold text-zinc-950">{loading ? '...' : kpis.total}</span>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-650">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Completed Gates</span>
            <span className="text-xl font-extrabold text-zinc-950">{loading ? '...' : kpis.completed}</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-650">
            <TrendingUp className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Active Gates</span>
            <span className="text-xl font-extrabold text-zinc-950">{loading ? '...' : kpis.inProgress}</span>
          </div>
        </div>

        {/* Overdue */}
        <div className={`rounded-xl border p-4 shadow-sm flex items-center gap-3.5 ${
          kpis.overdue > 0 ? 'border-rose-200 bg-rose-50/10' : 'border-zinc-200 bg-white'
        }`}>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            kpis.overdue > 0 ? 'bg-rose-50 border border-rose-150 text-rose-600 animate-bounce' : 'bg-zinc-50 border border-zinc-200 text-zinc-500'
          }`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Timeline Delays</span>
            <span className={`text-xl font-extrabold ${kpis.overdue > 0 ? 'text-rose-700' : 'text-zinc-950'}`}>
              {loading ? '...' : kpis.overdue}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
        {/* Search & Layout Toggles */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by milestone name, details, or project..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full rounded-lg border border-zinc-250 bg-white pl-9.5 pr-4 py-2 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
            />
          </div>

          {/* Grid/List View Selector */}
          <div className="flex items-center rounded-lg border border-zinc-200 p-1 bg-zinc-50 shadow-sm self-end md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex p-1 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-brand-650 shadow-xs'
                  : 'text-zinc-450 hover:bg-zinc-200/50 hover:text-zinc-800'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex p-1 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-brand-650 shadow-xs'
                  : 'text-zinc-450 hover:bg-zinc-200/50 hover:text-zinc-800'
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dropdowns filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-zinc-150 text-xs">
          {/* Projects filter */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-500 uppercase tracking-wide block">Project Filter</label>
            <select
              value={filters.projectId}
              onChange={(e) => handleFilterChange('projectId', e.target.value)}
              className="w-full rounded border border-zinc-250 bg-white p-1.5 text-xs outline-none focus:border-brand-500"
            >
              <option value="ALL">All Projects</option>
              {projectsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Categories filter */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-500 uppercase tracking-wide block">Milestone Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full rounded border border-zinc-250 bg-white p-1.5 text-xs outline-none focus:border-brand-500"
            >
              <option value="ALL">All Categories</option>
              <option value="SURVEY">Survey</option>
              <option value="DESIGN">Design</option>
              <option value="PROCUREMENT">Procurement</option>
              <option value="INSTALLATION">Installation</option>
              <option value="ELECTRICAL">Electrical</option>
              <option value="TESTING">Testing</option>
              <option value="DOCUMENTATION">Documentation</option>
              <option value="APPROVAL">Approval</option>
              <option value="HANDOVER">Handover</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="space-y-1 flex flex-col justify-between">
            <div className="space-y-1">
              <label className="font-bold text-zinc-500 uppercase tracking-wide block">Status Filter</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full rounded border border-zinc-250 bg-white p-1.5 text-xs outline-none focus:border-brand-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>

            {/* Clear filters trigger */}
            {(filters.search || filters.projectId !== 'ALL' || filters.status !== 'ALL' || filters.category !== 'ALL') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[10px] font-extrabold text-brand-600 hover:text-brand-700 text-left pt-1.5"
              >
                Clear filters shortcut
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REGISTRY CONTENT */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-1.5 shadow-sm overflow-hidden animate-fade-in">
          {viewMode === 'list' ? (
            <MilestoneTable milestones={milestones} />
          ) : (
            <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
              {milestones.length === 0 ? (
                <div className="col-span-full py-12 text-center text-zinc-400 text-sm">
                  No milestones matched search criteria or filters.
                </div>
              ) : (
                milestones.map((m) => <MilestoneCard key={m.id} milestone={m} />)
              )}
            </div>
          )}
        </div>
      )}

      {/* PAGINATION PANEL */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 flex-wrap gap-2.5">
          <span>
            Showing <strong className="text-zinc-800">{(filters.page! - 1) * filters.limit! + 1}</strong> to{' '}
            <strong className="text-zinc-800">
              {Math.min(filters.page! * filters.limit!, total)}
            </strong>{' '}
            of <strong className="text-zinc-800">{total}</strong> total milestones
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
