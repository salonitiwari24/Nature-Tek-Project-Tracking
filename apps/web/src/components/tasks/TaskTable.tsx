import { Link } from 'react-router-dom';
import { Eye, Edit2, AlertCircle } from 'lucide-react';
import { TaskDetail, TaskService } from '../../services/taskService';
import { TaskStatusBadge } from './TaskStatusBadge';

interface TaskTableProps {
  tasks: TaskDetail[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] text-left text-sm">
        <thead className="border-b border-zinc-250 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3.5">Task ID</th>
            <th className="px-4 py-3.5">Task Name</th>
            <th className="px-4 py-3.5">Category</th>
            <th className="px-4 py-3.5">Project</th>
            <th className="px-4 py-3.5">Assigned To</th>
            <th className="px-4 py-3.5">Priority</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Due Date</th>
            <th className="px-4 py-3.5">Progress</th>
            <th className="px-4 py-3.5 text-center">Delay</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-4 py-12 text-center text-zinc-400">
                No tasks matched search criteria or selected filters.
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              const isOverdue = TaskService.isOverdue(task);
              const isDueSoon = TaskService.isDueSoon(task);
              const delayDays = TaskService.calculateDelayDays(task);

              return (
                <tr
                  key={task.id}
                  className={`transition-colors hover:bg-zinc-50/50 ${
                    isOverdue ? 'bg-rose-50/20' : isDueSoon ? 'bg-amber-50/10' : ''
                  }`}
                >
                  {/* Task ID */}
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-zinc-650">
                    {task.id}
                  </td>
                  {/* Task Name */}
                  <td className="px-4 py-4 min-w-[200px]">
                    <div className="flex flex-col">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="font-bold text-zinc-950 hover:text-brand-700 hover:underline transition-all"
                      >
                        {task.title}
                      </Link>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0 animate-bounce" />
                          Overdue by {delayDays} days
                        </span>
                      )}
                      {isDueSoon && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0 animate-pulse" />
                          Due soon (within 3d)
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Category */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <TaskStatusBadge type="category" value={task.category} />
                  </td>
                  {/* Project Context */}
                  <td className="px-4 py-4 max-w-[150px] truncate">
                    <Link
                      to={`/projects/${task.projectId}`}
                      className="font-semibold text-zinc-600 hover:text-brand-700 hover:underline"
                    >
                      {task.projectName}
                    </Link>
                  </td>
                  {/* Assignee */}
                  <td className="px-4 py-4">
                    <span className="font-semibold text-zinc-800">{task.assigneeName || 'Unassigned'}</span>
                    <span className="block text-[10px] text-zinc-400 font-medium">{task.assigneeRole}</span>
                  </td>
                  {/* Priority */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <TaskStatusBadge type="priority" value={task.priority} />
                  </td>
                  {/* Status */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <TaskStatusBadge type="status" value={task.status} />
                  </td>
                  {/* Due Date */}
                  <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-zinc-700">
                    {formatDate(task.dueDate)}
                  </td>
                  {/* Progress slider bar */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            task.status === 'DONE'
                              ? 'bg-brand-500'
                              : task.status === 'BLOCKED'
                                ? 'bg-red-500'
                                : 'bg-indigo-500'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-zinc-700">{task.progress}%</span>
                    </div>
                  </td>
                  {/* Delay Days */}
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    {delayDays > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-xs font-bold text-rose-700">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {delayDays}d
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 font-medium">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        to={`/tasks/${task.id}/edit`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                        title="Edit Task"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
