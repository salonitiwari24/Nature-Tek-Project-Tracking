import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserForm } from '../components/users/UserForm';
import { UserService, UserDetail } from '../services/userService';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      try {
        const found = await UserService.getUserById(id);
        if (found) {
          setUser(found);
        }
      } catch (err) {
        console.error('Failed to load user in edit page:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    try {
      await UserService.updateUser(id, data);
      alert('Corporate staff member account updated cleanly inside Registry.');
      navigate('/users');
    } catch (err) {
      console.error('Failed to update user record:', err);
      alert('Error updating staff account profile.');
    }
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Edit Team Member</h1>
        <p className="text-sm text-zinc-500">Modify corporate credentials and regional assignments</p>
      </div>

      <UserForm
        initialData={user}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/users')}
      />
    </div>
  );
}
