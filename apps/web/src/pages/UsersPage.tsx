import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, List, Grid } from 'lucide-react';
import { UserDetail, UserService, GetUsersFilters } from '../services/userService';
import { UserTable } from '../components/users/UserTable';
import { UserCard } from '../components/users/UserCard';

export default function UsersPage() {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [filters, setFilters] = useState<GetUsersFilters>({
    search: '',
    role: 'ALL',
    status: 'ALL',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await UserService.getUsers(filters);
        setUsers(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error('Failed to load user registries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [filters]);

  const handleFilterChange = (name: keyof GetUsersFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? (value as number) : 1,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: 'ALL',
      status: 'ALL',
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Staff Registry & Resource Center</h1>
          <p className="text-sm text-zinc-500">Track structural engineering staff, supervisors assignments, and individual completion rates</p>
        </div>
        <Link
          to="/users/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Add Team Member
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
        {/* Search & view mode triggers */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by full name, email address, or ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full rounded-lg border border-zinc-250 bg-white pl-9.5 pr-4 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
            />
          </div>

          {/* Grid / List Selector */}
          <div className="flex items-center rounded-lg border border-zinc-200 p-1 bg-zinc-50 shadow-sm self-end md:self-auto">
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

        {/* Dropdowns filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-zinc-150 text-xs">
          {/* Role Filter */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-500 uppercase tracking-wide block">Functional Role</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full rounded border border-zinc-250 bg-white p-1.5 text-xs outline-none focus:border-brand-500"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="SITE_SUPERVISOR">Site Supervisor</option>
              <option value="ENGINEER">Engineer</option>
              <option value="TEAM_MEMBER">Team Member</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-500 uppercase tracking-wide block">Status Filter</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded border border-zinc-250 bg-white p-1.5 text-xs outline-none focus:border-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>
          </div>

          {/* Clear filters shortcuts */}
          <div className="flex items-end justify-start sm:justify-end">
            {(filters.search || filters.role !== 'ALL' || filters.status !== 'ALL') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[10px] font-extrabold text-brand-600 hover:text-brand-700 pb-1.5"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REGISTRY CONTENT */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-1.5 shadow-sm overflow-hidden">
          {viewMode === 'list' ? (
            <UserTable users={users} />
          ) : (
            <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
              {users.length === 0 ? (
                <div className="col-span-full py-12 text-center text-zinc-400 text-sm">
                  No staff members matched search or filters.
                </div>
              ) : (
                users.map((u) => <UserCard key={u.id} user={u} />)
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
            of <strong className="text-zinc-800">{total}</strong> staff members
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={filters.page === 1}
              onClick={() => handleFilterChange('page', filters.page! - 1)}
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 font-bold shadow-xs hover:bg-zinc-50 disabled:opacity-40"
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
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 font-bold shadow-xs hover:bg-zinc-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
