import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ChevronLeft, ChevronRight, Grid, List, RefreshCw } from 'lucide-react';
import { ProjectService, ProjectDetail, GetProjectsFilters } from '../services/projectService';
import { ProjectTable } from '../components/projects/ProjectTable';
import { ProjectCard } from '../components/projects/ProjectCard';

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter & Search states
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('ALL');
  const [projectType, setProjectType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<GetProjectsFilters['sortBy']>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 8; // Number of items per page

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ProjectService.getProjects({
        search,
        status,
        type: projectType,
        sortBy,
        sortOrder,
        page,
        limit,
      });
      setProjects(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, status, projectType, sortBy, sortOrder, page]);

  useEffect(() => {
    // Reset to page 1 on filter changes
    setPage(1);
  }, [search, status, projectType, sortBy, sortOrder]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Solar Installation Registry</h1>
          <p className="text-sm text-zinc-500">Manage, allocate resources, and track physical solar gates</p>
        </div>

        <Link
          to="/projects/new"
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      </div>

      {/* Control Panel: Filters, Search, Sort */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search code, name, client, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-250 bg-white pl-9 pr-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
            />
          </div>

          {/* Quick Selects */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-zinc-250 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm outline-none hover:border-zinc-300 focus:border-brand-500"
              >
                <option value="ALL">All States</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Type Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">Type</span>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="rounded-lg border border-zinc-250 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm outline-none hover:border-zinc-300 focus:border-brand-500"
              >
                <option value="ALL">All Systems</option>
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="INDUSTRIAL">Industrial</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as GetProjectsFilters['sortBy'])}
                className="rounded-lg border border-zinc-250 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm outline-none hover:border-zinc-300 focus:border-brand-500"
              >
                <option value="date">Start Date</option>
                <option value="progress">Progress %</option>
                <option value="capacity">Capacity</option>
                <option value="name">Project Name</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="rounded-lg border border-zinc-250 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 shadow-sm outline-none hover:border-zinc-300 focus:border-brand-500"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`rounded px-1.5 py-1 transition-colors ${
                  viewMode === 'list' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                }`}
                title="Table View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded px-1.5 py-1 transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                }`}
                title="Card Grid"
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-600" />
            <span className="text-sm font-medium text-zinc-500 font-semibold">Synchronizing solar arrays...</span>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <ProjectTable projects={projects} />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.length === 0 ? (
            <div className="col-span-full flex h-48 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-400 text-sm italic">
              No projects matched current filters.
            </div>
          ) : (
            projects.map((p) => <ProjectCard key={p.id} project={p} />)
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-200 pt-4 text-xs font-semibold text-zinc-500">
          <span>
            Showing <strong className="text-zinc-950">{projects.length}</strong> of{' '}
            <strong className="text-zinc-950">{total}</strong> total projects
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex h-8 items-center gap-1 rounded border border-zinc-200 bg-white px-2.5 text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 shadow-sm"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <span className="text-zinc-700">
              Page <strong className="text-zinc-950">{page}</strong> of{' '}
              <strong className="text-zinc-950">{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex h-8 items-center gap-1 rounded border border-zinc-200 bg-white px-2.5 text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 shadow-sm"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
