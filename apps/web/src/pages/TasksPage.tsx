import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Grid, Search, PlusCircle, Filter } from 'lucide-react';
import { TaskDetail, TaskService, GetTasksFilters } from '../services/taskService';
import { ProjectService } from '../services/projectService';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskCard } from '../components/tasks/TaskCard';

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskDetail[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [filters, setFilters] = useState<GetTasksFilters>({
    search: '',
    projectId: 'ALL',
    status: 'ALL',
    priority: 'ALL',
    category: 'ALL',
    sortBy: 'dueDate',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
  });

  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Load projects for project selection filter dropdown
    const loadProjectsList = async () => {
      try {
        const response = await ProjectService.getProjects({ limit: 100 });
        setProjects(response.data.map((p) => ({ id: p.id, name: p.name })));
      } catch (err) {
        console.error('Failed to load project filters:', err);
      }
    };
    loadProjectsList();
  }, []);

  useEffect(() => {
    const fetchTasksList = async () => {
      setLoading(true);
      try {
        const result = await TaskService.getTasks(filters);
        setTasks(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error('Error fetching tasks registry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasksList();
  }, [filters]);

  const handleFilterChange = (name: keyof GetTasksFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? (value as number) : 1, // reset page to 1 on filters modify
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      projectId: 'ALL',
      status: 'ALL',
      priority: 'ALL',
      category: 'ALL',
      sortBy: 'dueDate',
      sortOrder: 'asc',
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Task Management Registry</h1>
          <p className="text-sm text-zinc-500">Track task priorities, assignments, categories, and delays across active solar arrays</p>
        </div>
        <Link
          to="/tasks/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Add Task
        </Link>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
        {/* Row 1: Search and Layout Toggles */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by task title, description, or project name..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full rounded-lg border border-zinc-250 bg-white pl-9.5 pr-4 py-2 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center gap-3.5 self-end md:self-auto">
            {/* Sorting */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-zinc-500 uppercase tracking-wide">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                className="rounded border border-zinc-250 bg-white px-2 py-1 text-sm outline-none focus:border-brand-500"
              >
                <option value="dueDate">Due Date</option>
                <option value="progress">Progress %</option>
                <option value="priority">Priority</option>
                <option value="name">Task Name</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as any)}
                className="rounded border border-zinc-250 bg-white px-2 py-1 text-sm outline-none focus:border-brand-500"
              >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
            </div>

            {/* Grid/List View Toggles */}
            <div className="flex items-center rounded-lg border border-zinc-200 p-1 bg-zinc-50 shadow-sm">
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
        </div>

        {/* Row 2: Filtering Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-150 text-xs">
          {/* Projects filter */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-500 uppercase tracking-wide block">Project Context</label>
            <select
              value={filters.projectId}
              onChange={(e) => handleFilterChange('projectId', e.target.value)}
              className="w-full rounded border border-zinc-250 bg-white p-1.5 text-xs outline-none focus:border-brand-500"
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Categories filter */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-500 uppercase tracking-wide block">Category</label>
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
            </select>
          </div>

          {/* Status filter */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-500 uppercase tracking-wide block">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded border border-zinc-250 bg-white p-1.5 text-xs outline-none focus:border-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="BLOCKED">Blocked</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="space-y-1 flex flex-col justify-between">
            <div className="space-y-1">
              <label className="font-bold text-zinc-500 uppercase tracking-wide block">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full rounded border border-zinc-250 bg-white p-1.5 text-xs outline-none focus:border-brand-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            
            {/* Clear filters shortcut */}
            {(filters.search || filters.projectId !== 'ALL' || filters.status !== 'ALL' || filters.priority !== 'ALL' || filters.category !== 'ALL') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[10px] font-extrabold text-brand-600 hover:text-brand-700 text-left pt-1.5"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RENDER TASKS SECTION */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-1.5 shadow-sm overflow-hidden">
          {viewMode === 'list' ? (
            <TaskTable tasks={tasks} />
          ) : (
            <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.length === 0 ? (
                <div className="col-span-full py-12 text-center text-zinc-400 text-sm">
                  No tasks matched search criteria or selected filters.
                </div>
              ) : (
                tasks.map((task) => <TaskCard key={task.id} task={task} />)
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
            of <strong className="text-zinc-800">{total}</strong> total tasks
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={filters.page === 1}
              onClick={() => handleFilterChange('page', filters.page! - 1)}
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 font-bold shadow-xs hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white"
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
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 font-bold shadow-xs hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
