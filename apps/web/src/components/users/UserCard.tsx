import { Link } from 'react-router-dom';
import { Mail, Calendar, Eye, Edit2, Briefcase } from 'lucide-react';
import { UserDetail } from '../../services/userService';
import { UserStatusBadge } from './UserStatusBadge';

interface UserCardProps {
  user: UserDetail;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="relative flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-zinc-350">
      
      {/* Header ID & Status */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-bold text-zinc-400">{user.id}</span>
        <UserStatusBadge type="status" value={user.status} />
      </div>

      {/* Profile Details */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-extrabold text-sm uppercase">
          {user.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-extrabold text-zinc-950 truncate">
            <Link to={`/users/${user.id}`} className="hover:underline hover:text-brand-700">
              {user.name}
            </Link>
          </h4>
          <span className="mt-1 block">
            <UserStatusBadge type="role" value={user.role} />
          </span>
        </div>
      </div>

      <hr className="my-3 border-zinc-150" />

      {/* Meta Specs */}
      <div className="space-y-2 text-xs text-zinc-600">
        <div className="flex items-center gap-1.5 truncate">
          <Mail className="h-3.5 w-3.5 text-zinc-400" />
          <span className="truncate">{user.email}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
          <span>Projects: <strong className="text-zinc-800">{user.assignedProjects.length} Active</strong></span>
        </div>

        {/* Completion rate (Requirement 3) */}
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-zinc-350 flex items-center justify-center text-[7px] font-extrabold text-zinc-450">%</div>
          <span>
            Completion Rate:{' '}
            <strong className={`font-extrabold ${
              user.performance.completionRate >= 85
                ? 'text-emerald-700'
                : user.performance.completionRate >= 70
                  ? 'text-amber-700'
                  : 'text-rose-700'
            }`}>
              {user.performance.completionRate}%
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          <span>Last login: <strong className="text-zinc-800">{user.lastActivity.substring(0, 10)}</strong></span>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center justify-end gap-1.5 mt-4 pt-3.5 border-t border-zinc-150">
        <Link
          to={`/users/${user.id}`}
          className="inline-flex h-7 px-2.5 items-center justify-center gap-1 rounded-md border border-zinc-200 bg-white text-xs font-bold text-zinc-650 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-950"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
        <Link
          to={`/users/${user.id}/edit`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-550 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
