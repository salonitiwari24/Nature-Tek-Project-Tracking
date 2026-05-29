import { Link } from 'react-router-dom';
import { Eye, Edit2 } from 'lucide-react';
import { UserDetail } from '../../services/userService';
import { UserStatusBadge } from './UserStatusBadge';

interface UserTableProps {
  users: UserDetail[];
}

export function UserTable({ users }: UserTableProps) {
  const formatDate = (dateStr: string) => {
    return dateStr.substring(0, 10);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="border-b border-zinc-250 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3.5">ID</th>
            <th className="px-4 py-3.5">Name</th>
            <th className="px-4 py-3.5">Email Address</th>
            <th className="px-4 py-3.5">Role</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-center">Projects</th>
            <th className="px-4 py-3.5 text-center">Tasks Done</th>
            <th className="px-4 py-3.5 text-center">Completion %</th>
            <th className="px-4 py-3.5">Last Active</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {users.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-4 py-12 text-center text-zinc-400">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-zinc-50/50">
                {/* ID */}
                <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-zinc-400">
                  {u.id}
                </td>
                {/* Name */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <Link
                    to={`/users/${u.id}`}
                    className="font-bold text-zinc-950 hover:text-brand-700 hover:underline"
                  >
                    {u.name}
                  </Link>
                </td>
                {/* Email */}
                <td className="px-4 py-4 text-xs font-semibold text-zinc-600 whitespace-nowrap">
                  {u.email}
                </td>
                {/* Role */}
                <td className="whitespace-nowrap px-4 py-4">
                  <UserStatusBadge type="role" value={u.role} />
                </td>
                {/* Status */}
                <td className="whitespace-nowrap px-4 py-4">
                  <UserStatusBadge type="status" value={u.status} />
                </td>
                {/* Assigned Projects */}
                <td className="whitespace-nowrap px-4 py-4 text-center font-bold text-zinc-800">
                  {u.assignedProjects.length}
                </td>
                {/* Tasks Completed */}
                <td className="whitespace-nowrap px-4 py-4 text-center text-xs text-zinc-650">
                  <span className="font-extrabold text-zinc-900">{u.performance.completedTasks}</span> / {u.performance.assignedTasks}
                </td>
                {/* Completion rate (Requirement 3) */}
                <td className="whitespace-nowrap px-4 py-4 text-center">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-extrabold border ${
                    u.performance.completionRate >= 85
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : u.performance.completionRate >= 70
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    {u.performance.completionRate}%
                  </span>
                </td>
                {/* Last Active */}
                <td className="whitespace-nowrap px-4 py-4 text-xs text-zinc-500 font-medium">
                  {formatDate(u.lastActivity)}
                </td>
                {/* Actions */}
                <td className="whitespace-nowrap px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/users/${u.id}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                      title="View Profile Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      to={`/users/${u.id}/edit`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                      title="Edit User"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
