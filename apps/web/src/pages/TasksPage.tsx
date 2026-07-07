import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  Grid,
  Search,
  PlusCircle,
} from 'lucide-react';

import {
  TaskDetail,
  TaskService,
  GetTasksFilters,
} from '../services/taskService';

import { ProjectService } from '../services/projectService';

import { TaskTable } from '../components/tasks/TaskTable';
import { TaskCard } from '../components/tasks/TaskCard';

export default function TasksPage() {
  const [tasks, setTasks] =
    useState<TaskDetail[]>([]);

  const [viewMode, setViewMode] =
    useState<'list' | 'grid'>(
      'list'
    );

  const [loading, setLoading] =
    useState<boolean>(true);

  const [projects, setProjects] =
    useState<
      { id: string; name: string }[]
    >([]);

  const [filters, setFilters] =
    useState<GetTasksFilters>({
      search: '',
      projectId: 'ALL',
      status: 'ALL',
      priority: 'ALL',
      page: 1,
      limit: 10,
    });

  // LOAD PROJECT FILTERS
  useEffect(() => {
    const loadProjectsList =
      async () => {
        try {
          const projects =
            await ProjectService.getProjects(
              {
                limit: 100,
              }
            );

          console.log(
            'Projects loaded:',
            projects
          );

          setProjects(
            Array.isArray(
              projects
            )
              ? projects.map(
                  (p) => ({
                    id: p.id,
                    name: p.name,
                  })
                )
              : []
          );
        } catch (err) {
          console.error(
            'Failed to load project filters:',
            err
          );

          setProjects([]);
        }
      };

    loadProjectsList();
  }, []);

  // LOAD TASKS
  useEffect(() => {
    const fetchTasksList =
      async () => {
        setLoading(true);

        try {
          const tasks =
            await TaskService.getTasks(
              filters
            );

          console.log(
            'Tasks loaded:',
            tasks
          );

          setTasks(
            Array.isArray(
              tasks
            )
              ? tasks
              : []
          );
        } catch (err) {
          console.error(
            'Error fetching tasks registry:',
            err
          );

          setTasks([]);
        } finally {
          setLoading(false);
        }
      };

    fetchTasksList();
  }, [filters]);

  const handleFilterChange = (
    name: keyof GetTasksFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters =
    () => {
      setFilters({
        search: '',
        projectId: 'ALL',
        status: 'ALL',
        priority: 'ALL',
        page: 1,
        limit: 10,
      });
    };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Task Management Registry
          </h1>

          <p className="text-sm text-zinc-500">
            Track tasks across
            projects
          </p>
        </div>

        <Link
          to="/tasks/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <PlusCircle className="h-4 w-4" />
          Add Task
        </Link>
      </div>

      {/* FILTERS */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* SEARCH */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />

            <input
              type="text"
              placeholder="Search tasks..."
              value={
                filters.search
              }
              onChange={(e) =>
                handleFilterChange(
                  'search',
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-zinc-300 pl-10 pr-4 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-1">
            <button
              type="button"
              onClick={() =>
                setViewMode(
                  'list'
                )
              }
              className={`rounded-md p-2 ${
                viewMode ===
                'list'
                  ? 'bg-white shadow'
                  : ''
              }`}
            >
              <List className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode(
                  'grid'
                )
              }
              className={`rounded-md p-2 ${
                viewMode ===
                'grid'
                  ? 'bg-white shadow'
                  : ''
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t pt-3">
          {/* PROJECT */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">
              Project
            </label>

            <select
              value={
                filters.projectId
              }
              onChange={(e) =>
                handleFilterChange(
                  'projectId',
                  e.target.value
                )
              }
              className="w-full rounded border border-zinc-300 p-2 text-sm"
            >
              <option value="ALL">
                All Projects
              </option>

              {projects.map(
                (
                  project
                ) => (
                  <option
                    key={
                      project.id
                    }
                    value={
                      project.id
                    }
                  >
                    {
                      project.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">
              Status
            </label>

            <select
              value={
                filters.status
              }
              onChange={(e) =>
                handleFilterChange(
                  'status',
                  e.target.value
                )
              }
              className="w-full rounded border border-zinc-300 p-2 text-sm"
            >
              <option value="ALL">
                All Statuses
              </option>
              <option value="NOT_STARTED">
                Not Started
              </option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="BLOCKED">
                Blocked
              </option>
              <option value="DONE">
                Done
              </option>
            </select>
          </div>

          {/* PRIORITY */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">
              Priority
            </label>

            <select
              value={
                filters.priority
              }
              onChange={(e) =>
                handleFilterChange(
                  'priority',
                  e.target.value
                )
              }
              className="w-full rounded border border-zinc-300 p-2 text-sm"
            >
              <option value="ALL">
                All Priorities
              </option>
              <option value="LOW">
                Low
              </option>
              <option value="MEDIUM">
                Medium
              </option>
              <option value="HIGH">
                High
              </option>
              <option value="URGENT">
                Urgent
              </option>
            </select>
          </div>

          {/* CLEAR */}
          <div className="flex items-end">
            <button
              onClick={
                handleClearFilters
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white">
          Loading tasks...
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm overflow-hidden">
          {viewMode ===
          'list' ? (
            <TaskTable
              tasks={
                tasks ?? []
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.length ===
              0 ? (
                <div className="col-span-full py-12 text-center text-zinc-400">
                  No tasks found
                </div>
              ) : (
                tasks.map(
                  (task) => (
                    <TaskCard
                      key={
                        task.id
                      }
                      task={
                        task
                      }
                    />
                  )
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}