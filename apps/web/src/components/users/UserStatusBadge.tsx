import { UserRole } from '../../services/userService';

interface UserStatusBadgeProps {
  type: 'role' | 'status';
  value: UserRole | 'ACTIVE' | 'SUSPENDED';
}

export function UserStatusBadge({ type, value }: UserStatusBadgeProps) {
  if (type === 'status') {
    const status = value as 'ACTIVE' | 'SUSPENDED';
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            Active
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-rose-50 border border-rose-250 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 uppercase tracking-wider">
            Suspended
          </span>
        );
    }
  }

  if (type === 'role') {
    const role = value as UserRole;
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-rose-700 tracking-wider">
            Admin
          </span>
        );
      case 'PM':
        return (
          <span className="inline-flex rounded bg-brand-50 border border-brand-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-brand-700 tracking-wider">
            Project Mgr
          </span>
        );
      case 'SUPERVISOR':
        return (
          <span className="inline-flex rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-amber-700 tracking-wider">
            Supervisor
          </span>
        );
      case 'DESIGN':
      case 'SERVICE':
        return (
          <span className="inline-flex rounded bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-indigo-700 tracking-wider">
            Engineer
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-zinc-500 tracking-wider">
            Team Member
          </span>
        );
    }
  }

  return null;
}
