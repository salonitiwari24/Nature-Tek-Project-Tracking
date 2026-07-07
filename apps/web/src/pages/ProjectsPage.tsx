import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  RefreshCw,
} from 'lucide-react';

import {
  ProjectService,
  ProjectDetail,
  GetProjectsFilters,
} from '../services/projectService';

import { ProjectTable } from '../components/projects/ProjectTable';
import { ProjectCard } from '../components/projects/ProjectCard';

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('ALL');
  const [projectType, setProjectType] = useState<string>('ALL');

  const [sortBy, setSortBy] =
    useState<GetProjectsFilters['sortBy']>('date');

  const [sortOrder, setSortOrder] =
    useState<'asc' | 'desc'>('desc');

  const [page, setPage] = useState<number>(1);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);

    try {
      const response =
        await ProjectService.getProjects({
          search,
          status,
          type: projectType,
          sortBy,
          sortOrder,
          page,
          limit: 8,
        });

      setProjects(response ?? []);
      setTotal(response?.length ?? 0);
    } catch (err) {
      console.error(
        'Failed to load projects:',
        err
      );

      setProjects([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    search,
    status,
    projectType,
    sortBy,
    sortOrder,
    page,
  ]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Solar Installation Registry
          </h1>

          <p className="text-sm text-zinc-500">
            Manage solar projects
          </p>
        </div>

        <Link
          to="/projects/new"
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search className="h-4 w-4" />
            </span>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-lg border border-zinc-250 bg-white pl-9 pr-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="ALL">
                All Status
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="ON_HOLD">
                On Hold
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="ARCHIVED">
                Archived
              </option>
            </select>

            <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1">
              <button
                onClick={() =>
                  setViewMode('list')
                }
                className={`rounded px-2 py-1 ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm'
                    : ''
                }`}
              >
                <List className="h-4 w-4" />
              </button>

              <button
                onClick={() =>
                  setViewMode('grid')
                }
                className={`rounded px-2 py-1 ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm'
                    : ''
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-600" />

            <span className="text-sm font-medium text-zinc-500">
              Loading projects...
            </span>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <ProjectTable projects={projects} />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.length === 0 ? (
            <div className="col-span-full text-center text-zinc-400">
              No projects found.
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))
          )}
        </div>
      )}

      <div className="border-t pt-4 text-sm text-zinc-500">
        Showing {projects.length} of {total}{' '}
        projects
      </div>
    </div>
  );
}
