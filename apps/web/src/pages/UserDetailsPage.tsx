import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Mail, Calendar, Briefcase, CheckSquare, Clock, ShieldAlert, Award } from 'lucide-react';
import { UserService, UserDetail } from '../services/userService';
import { UserStatusBadge } from '../components/users/UserStatusBadge';
import { ProjectService } from '../services/projectService';

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [projectsList, setProjectsList] = useState<{ id: string; name: string; capacity: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const found = await UserService.getUserById(id);
        if (found) {
          setUser(found);

          // Gather actual project names for assignedProjects IDs
          const projResult = await ProjectService.getProjects({ limit: 100 });
          const matched = projResult.data
            .filter((p) => found.assignedProjects.includes(p.id))
            .map((p) => ({ id: p.id, name: p.name, capacity: p.capacity }));
          setProjectsList(matched);
        }
      } catch (err) {
        console.error('Failed to load user details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUserDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 rounded-xl border border-zinc-250 bg-white">
        <p className="text-sm font-semibold text-zinc-500">Staff profile could not be found.</p>
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
        >
          Back to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-400">{user.id}</span>
              <UserStatusBadge type="status" value={user.status} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-955">{user.name}</h1>
          </div>
        </div>

        <Link
          to={`/users/${user.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-650 shadow-sm transition-colors hover:bg-zinc-50 self-start sm:self-auto"
        >
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>

      {/* PERFORMANCE KPI METRICS ROW (Requirement 3) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Assigned Projects */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1.5">
          <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[9px] flex items-center gap-1">
            <Briefcase className="h-3 w-3 text-zinc-400" />
            Assigned Projects
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-zinc-950">{user.assignedProjects.length}</span>
            <span className="text-[10px] font-semibold text-zinc-400">Regional Arrays</span>
          </div>
        </div>

        {/* Assigned Tasks */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1.5">
          <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[9px] flex items-center gap-1">
            <CheckSquare className="h-3 w-3 text-zinc-400" />
            Assigned Tasks
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-zinc-950">{user.performance.assignedTasks}</span>
            <span className="text-[10px] font-semibold text-zinc-400">Execution tasks</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1.5">
          <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[9px] flex items-center gap-1">
            <Award className="h-3 w-3 text-zinc-450" />
            Completed Tasks
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-650">{user.performance.completedTasks}</span>
            <span className="text-[10px] font-semibold text-zinc-400">Closed out</span>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1.5">
          <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[9px] flex items-center gap-1">
            <ShieldAlert className="h-3 w-3 text-zinc-455" />
            Overdue Tasks
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${user.performance.overdueTasks > 0 ? 'text-rose-650 animate-pulse' : 'text-zinc-950'}`}>
              {user.performance.overdueTasks}
            </span>
            <span className="text-[10px] font-semibold text-zinc-400">Action items</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-1.5 col-span-2 lg:col-span-1">
          <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[9px] flex items-center gap-1">
            <Clock className="h-3 w-3 text-zinc-400" />
            Completion Rate %
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${
              user.performance.completionRate >= 85
                ? 'text-emerald-700'
                : user.performance.completionRate >= 70
                  ? 'text-amber-700'
                  : 'text-rose-700'
            }`}>
              {user.performance.completionRate}%
            </span>
            <span className="text-[10px] font-semibold text-zinc-450">efficiency</span>
          </div>
        </div>
      </div>

      {/* DETAILED WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Info Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CORPORATE PROFILE INFO */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-2">Account Specifications</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="space-y-1 text-zinc-650 bg-zinc-50 border p-3 rounded-lg">
                <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[8px]">Primary Email</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-zinc-800">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  {user.email}
                </div>
              </div>

              <div className="space-y-1 text-zinc-650 bg-zinc-50 border p-3 rounded-lg">
                <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[8px]">Security Role & Classification</span>
                <div className="mt-1 flex items-center gap-2">
                  <UserStatusBadge type="role" value={user.role} />
                  <span className="text-[10px] text-zinc-400 italic">Level-verified.</span>
                </div>
              </div>

              <div className="space-y-1 text-zinc-650 bg-zinc-50 border p-3 rounded-lg">
                <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[8px]">Last Sign-in Activity</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-zinc-800">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  {user.lastActivity}
                </div>
              </div>

              <div className="space-y-1 text-zinc-650 bg-zinc-50 border p-3 rounded-lg">
                <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[8px]">Access Status</span>
                <div className="mt-1.5">
                  <UserStatusBadge type="status" value={user.status} />
                </div>
              </div>

            </div>
          </div>

          {/* PROJECT ASSIGNMENT GRIDS */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">Assigned Solar Projects ({projectsList.length})</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Physical installations currently mapped under this team member</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-450">
                  <tr>
                    <th className="px-3 py-2.5">Project ID</th>
                    <th className="px-3 py-2.5">Solar Project Name</th>
                    <th className="px-3 py-2.5">Contract Capacity</th>
                    <th className="px-3 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 bg-white">
                  {projectsList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-zinc-400 italic">
                        No active project mappings assigned.
                      </td>
                    </tr>
                  ) : (
                    projectsList.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/50">
                        <td className="whitespace-nowrap px-3 py-3 font-mono font-bold text-zinc-500">{p.id}</td>
                        <td className="px-3 py-3 font-bold text-zinc-950">{p.name}</td>
                        <td className="px-3 py-3 text-zinc-650 font-semibold">{p.capacity} kW</td>
                        <td className="whitespace-nowrap px-3 py-3 text-right">
                          <Link
                            to={`/projects/${p.id}`}
                            className="inline-flex items-center gap-1 font-bold text-brand-650 hover:underline hover:text-brand-700"
                          >
                            Access Project
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Action sidebar summaries */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm text-xs space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-950 border-b border-zinc-150 pb-2">Profile Actions</h3>
            <p className="text-zinc-500 leading-relaxed leading-5">
              Ensure functional roles correspond cleanly to daily operational activities. Suspended members will have their API access keys invalidated.
            </p>
            <Link
              to={`/users/${user.id}/edit`}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 py-2.5 font-bold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Configure Credentials
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
