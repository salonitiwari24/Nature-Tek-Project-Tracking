import { Link } from 'react-router-dom';
import { Eye, Edit2, AlertCircle } from 'lucide-react';
import {
  TaskDetail,
  TaskService,
} from '../../services/taskService';
import { TaskStatusBadge } from './TaskStatusBadge';

interface TaskTableProps {
  tasks?: TaskDetail[];
}

export function TaskTable({
  tasks = [],
}: TaskTableProps) {
  const formatDate = (
    dateStr?: string | null
  ) => {
    if (!dateStr) return '—';

    const d = new Date(dateStr);

    return d.toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    );
  };

  const getProgress = (
    task: TaskDetail
  ) => {
    switch (
      task.status
    ) {
      case 'DONE':
        return 100;

      case 'IN_REVIEW':
        return 85;

      case 'IN_PROGRESS':
        return 50;

      case 'BLOCKED':
        return 20;

      case 'NOT_STARTED':
      default:
        return 0;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="border-b border-zinc-250 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3.5">
              Task ID
            </th>

            <th className="px-4 py-3.5">
              Task Name
            </th>

            <th className="px-4 py-3.5">
              Project
            </th>

            <th className="px-4 py-3.5">
              Stage
            </th>

            <th className="px-4 py-3.5">
              Assigned To
            </th>

            <th className="px-4 py-3.5">
              Priority
            </th>

            <th className="px-4 py-3.5">
              Status
            </th>

            <th className="px-4 py-3.5">
              Due Date
            </th>

            <th className="px-4 py-3.5">
              Progress
            </th>

            <th className="px-4 py-3.5 text-center">
              Delay
            </th>

            <th className="px-4 py-3.5 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200 bg-white">
          {tasks.length ===
          0 ? (
            <tr>
              <td
                colSpan={11}
                className="px-4 py-12 text-center text-zinc-400"
              >
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map(
              (task) => {
                const isOverdue =
                  TaskService.isOverdue(
                    task
                  );

                const delayDays =
                  TaskService.calculateDelayDays(
                    task
                  );

                const progress =
                  getProgress(
                    task
                  );

                return (
                  <tr
                    key={
                      task.id
                    }
                    className={`transition-colors hover:bg-zinc-50/50 ${
                      isOverdue
                        ? 'bg-rose-50/20'
                        : ''
                    }`}
                  >
                    {/* ID */}
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-zinc-650">
                      {
                        task.id
                      }
                    </td>

                    {/* Title */}
                    <td className="px-4 py-4 min-w-[220px]">
                      <div className="flex flex-col">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="font-bold text-zinc-950 hover:text-brand-700 hover:underline"
                        >
                          {
                            task.title
                          }
                        </Link>

                        {task.description && (
                          <span className="text-xs text-zinc-500 truncate max-w-[250px]">
                            {
                              task.description
                            }
                          </span>
                        )}

                        {isOverdue && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            Overdue by{' '}
                            {
                              delayDays
                            }{' '}
                            days
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Project */}
                    <td className="px-4 py-4">
                      <Link
                        to={`/projects/${task.projectId}`}
                        className="font-semibold text-zinc-600 hover:text-brand-700 hover:underline"
                      >
                        {
                          task.projectName
                        }
                      </Link>
                    </td>

                    {/* Stage */}
                    <td className="px-4 py-4 text-xs font-medium text-zinc-600">
                      {
                        task.stage
                      }
                    </td>

                    {/* Assignee */}
<td className="px-4 py-4">
  <span className="font-semibold text-zinc-800">
    {task.assignee
      ? `${task.assignee.firstName} ${task.assignee.lastName}`
      : 'Unassigned'}
  </span>
</td>

                    {/* Priority */}
                    <td className="px-4 py-4">
                      <TaskStatusBadge
                        type="priority"
                        value={
                          task.priority
                        }
                      />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <TaskStatusBadge
                        type="status"
                        value={
                          task.status
                        }
                      />
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-4 text-xs font-semibold text-zinc-700">
                      {formatDate(
                        task.dueAt
                      )}
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              task.status ===
                              'DONE'
                                ? 'bg-emerald-500'
                                : task.status ===
                                    'BLOCKED'
                                  ? 'bg-red-500'
                                  : 'bg-indigo-500'
                            }`}
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                        <span className="text-xs font-bold text-zinc-700">
                          {
                            progress
                          }
                          %
                        </span>
                      </div>
                    </td>

                    {/* Delay */}
                    <td className="text-center px-4 py-4">
                      {delayDays >
                      0 ? (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-xs font-bold text-rose-700">
                          <AlertCircle className="h-3 w-3" />
                          {
                            delayDays
                          }
                          d
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-right px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          to={`/tasks/${task.id}/edit`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              }
            )
          )}
        </tbody>
      </table>
    </div>
  );
}