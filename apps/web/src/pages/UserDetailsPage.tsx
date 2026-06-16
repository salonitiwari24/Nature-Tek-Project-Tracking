
import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
  Link,
} from 'react-router-dom';

import {
  ArrowLeft,
  Edit2,
  Mail,
  Calendar,
} from 'lucide-react';

import {
  UserService,
  UserDetail,
} from '../services/userService';

import { UserStatusBadge } from '../components/users/UserStatusBadge';

export default function UserDetailsPage() {
  const { id } =
    useParams<{
      id: string;
    }>();

  const navigate =
    useNavigate();

  const [
    user,
    setUser,
  ] =
    useState<UserDetail | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState<boolean>(
      true
    );

  useEffect(() => {
    const loadUser =
      async () => {
        if (!id)
          return;

        setLoading(
          true
        );

        try {
          const found =
            await UserService.getUserById(
              id
            );

          setUser(
            found
          );
        } catch (err) {
          console.error(
            'Failed to load user details:',
            err
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadUser();
  }, [id]);

  const formatDate = (
    date?: string
  ) => {
    if (!date)
      return '-';

    return new Date(
      date
    ).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-zinc-250 bg-white py-12 text-center">
        <p className="text-sm font-semibold text-zinc-500">
          User not
          found.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              '/users'
            )
          }
          className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
        >
          Back to
          Users
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                '/users'
              )
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm hover:text-zinc-900"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>

          <div>
            <p className="font-mono text-xs text-zinc-400">
              {
                user.id
              }
            </p>

            <h1 className="text-2xl font-bold text-zinc-950">
              {
                user.firstName
              }{' '}
              {
                user.lastName
              }
            </h1>
          </div>
        </div>

        <Link
          to={`/users/${user.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-zinc-50"
        >
          <Edit2 className="h-4 w-4" />
          Edit User
        </Link>
      </div>

      {/* INFO CARD */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-brand-700">
          User
          Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* EMAIL */}
          <div className="rounded-lg border bg-zinc-50 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase text-zinc-400">
              Email
            </p>

            <div className="flex items-center gap-2 font-semibold text-zinc-800">
              <Mail className="h-4 w-4 text-zinc-400" />
              {
                user.email
              }
            </div>
          </div>

          {/* ROLE */}
          <div className="rounded-lg border bg-zinc-50 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase text-zinc-400">
              Role
            </p>

            <UserStatusBadge
              type="role"
              value={
                user.role
              }
            />
          </div>

          {/* STATUS */}
          <div className="rounded-lg border bg-zinc-50 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase text-zinc-400">
              Status
            </p>

            <UserStatusBadge
              type="status"
              value={
                user.isActive
                  ? 'ACTIVE'
                  : 'SUSPENDED'
              }
            />
          </div>

          {/* CREATED */}
          <div className="rounded-lg border bg-zinc-50 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase text-zinc-400">
              Created
            </p>

            <div className="flex items-center gap-2 font-semibold text-zinc-800">
              <Calendar className="h-4 w-4 text-zinc-400" />
              {formatDate(
                user.createdAt
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

