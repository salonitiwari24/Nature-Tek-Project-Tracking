import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components/users/UserForm';
import { UserService } from '../services/userService';

export default function AddUserPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      await UserService.createUser(data);
      alert('Corporate staff member account created cleanly inside Registry.');
      navigate('/users');
    } catch (err) {
      console.error('Failed to create user record:', err);
      alert('Error creating staff account profile.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Add Team Member</h1>
        <p className="text-sm text-zinc-500">Configure corporate profile roles and project assignment maps</p>
      </div>

      <UserForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/users')}
      />
    </div>
  );
}
