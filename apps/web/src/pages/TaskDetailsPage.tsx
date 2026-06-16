import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowLeft,
  Edit2,
  CheckCircle2,
  Trash2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

import {
  TaskDetail,
  TaskService,
} from '../services/taskService';

import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge';

export default function TaskDetailsPage() {
  const { id } =
    useParams<{
      id: string;
    }>();

  const navigate =
    useNavigate();

  const [
    task,
    setTask,
  ] =
    useState<TaskDetail | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const loadTask =
    async () => {
      if (!id)
        return;

      try {
        setLoading(
          true
        );

        const data =
          await TaskService.getTaskById(
            id
          );

        setTask(
          data
        );
      } catch (
        err
      ) {
        console.error(
          'Failed to load task:',
          err
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleMarkComplete =
    async () => {
      if (!task)
        return;

      try {
        await TaskService.markCompleted(
          task.id
        );

        await loadTask();
      } catch (
        err
      ) {
        console.error(
          'Failed to complete task:',
          err
        );

        alert(
          'Failed to update task.'
        );
      }
    };

  const handleDelete =
    async () => {
      if (!task)
        return;

      const confirmed =
        confirm(
          'Delete this task?'
        );

      if (
        !confirmed
      )
        return;

      try {
        await TaskService.deleteTask(
          task.id
        );

        navigate(
          '/tasks'
        );
      } catch (
        err
      ) {
        console.error(
          'Delete failed:',
          err
        );

        alert(
          'Failed to delete task.'
        );
      }
    };

  const formatDate = (
    date?: string | null
  ) => {
    if (!date)
      return '—';

    return new Date(
      date
    ).toLocaleDateString(
      'en-US',
      {
        year:
          'numeric',
        month:
          'long',
        day: 'numeric',
      }
    );
  };

  if (
    loading
  ) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">
          Task not
          found.
        </p>
      </div>
    );
  }

  const overdue =
    TaskService.isOverdue(
      task
    );

  const delayDays =
    TaskService.calculateDelayDays(
      task
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate(
                '/tasks'
              )
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <span className="font-mono text-xs text-zinc-400">
              {
                task.id
              }
            </span>

            <h1 className="text-2xl font-bold text-zinc-950">
              {
                task.title
              }
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {task.status !==
            'DONE' && (
            <button
              onClick={
                handleMarkComplete
              }
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark
              Complete
            </button>
          )}

          <Link
            to={`/tasks/${task.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <Edit2 className="h-4 w-4" />
            Modify
          </Link>

          <button
            onClick={
              handleDelete
            }
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* OVERDUE ALERT */}
      {overdue && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <AlertTriangle className="h-5 w-5 text-rose-600" />

          <div>
            <h3 className="font-bold text-rose-800">
              Task is
              overdue
            </h3>

            <p className="text-sm text-rose-700">
              Delayed by{' '}
              {
                delayDays
              }{' '}
              days.
            </p>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-400">
              Project
            </p>

            <Link
              to={`/projects/${task.projectId}`}
              className="font-semibold text-brand-700 hover:underline"
            >
              {
                task.projectName
              }
            </Link>
          </div>

          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-400">
              Stage
            </p>

            <span className="font-semibold">
              {task.stage.replace(
                /_/g,
                ' '
              )}
            </span>
          </div>

          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-400">
              Status
            </p>

            <TaskStatusBadge
              type="status"
              value={
                task.status
              }
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-400">
              Priority
            </p>

            <TaskStatusBadge
              type="priority"
              value={
                task.priority
              }
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-400">
              Assignee
            </p>

            <span>
              {task.assigneeName ??
                'Unassigned'}
            </span>
          </div>

          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-400">
              Due Date
            </p>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-400" />

              <span>
                {formatDate(
                  task.dueAt
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-bold uppercase text-zinc-400">
            Description
          </p>

          <div className="rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
            {task.description ||
              'No description added.'}
          </div>
        </div>
      </div>
    </div>
  );
}