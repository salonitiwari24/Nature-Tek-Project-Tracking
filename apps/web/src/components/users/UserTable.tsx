import { Link } from 'react-router-dom';
import { Eye, Edit2 } from 'lucide-react';
import { UserDetail } from '../../services/userService';
import { UserStatusBadge } from './UserStatusBadge';

interface UserTableProps {
  users: UserDetail[];
}

export function UserTable({
  users,
}: UserTableProps) {
  const formatDate = (
    dateStr?: string
  ) => {
    if (!dateStr)
      return '-';

    return new Date(
      dateStr
    )
      .toISOString()
      .substring(
        0,
        10
      );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-zinc-250 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3.5">
              ID
            </th>

            <th className="px-4 py-3.5">
              Name
            </th>

            <th className="px-4 py-3.5">
              Email
            </th>

            <th className="px-4 py-3.5">
              Role
            </th>

            <th className="px-4 py-3.5">
              Status
            </th>

            <th className="px-4 py-3.5">
              Created
            </th>

            <th className="px-4 py-3.5 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200 bg-white">
          {users.length ===
          0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-12 text-center text-zinc-400"
              >
                No users
                found.
              </td>
            </tr>
          ) : (
            users.map(
              (u) => (
                <tr
                  key={
                    u.id
                  }
                  className="transition-colors hover:bg-zinc-50/50"
                >
                  {/* ID */}
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-zinc-400">
                    {
                      u.id
                    }
                  </td>

                  {/* NAME */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <Link
                      to={`/users/${u.id}`}
                      className="font-bold text-zinc-950 hover:text-brand-700 hover:underline"
                    >
                      {
                        u.firstName
                      }{' '}
                      {
                        u.lastName
                      }
                    </Link>
                  </td>

                  {/* EMAIL */}
                  <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-zinc-600">
                    {
                      u.email
                    }
                  </td>

                  {/* ROLE */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <UserStatusBadge
                      type="role"
                      value={
                        u.role
                      }
                    />
                  </td>

                  {/* STATUS */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <UserStatusBadge
                      type="status"
                      value={
                        u.isActive
                          ? 'ACTIVE'
                          : 'SUSPENDED'
                      }
                    />
                  </td>

                  {/* CREATED */}
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-zinc-500 font-medium">
                    {formatDate(
                      u.createdAt
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/users/${u.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                        title="View User"
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
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}