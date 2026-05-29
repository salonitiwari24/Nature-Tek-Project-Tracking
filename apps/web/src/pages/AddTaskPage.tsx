import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskService } from '../services/taskService';

export default function AddTaskPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      await TaskService.createTask(data);
      navigate('/tasks');
    } catch (err) {
      console.error('Failed to create task:', err);
      alert('An error occurred while creating the task. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">Add Solar Project Task</h1>
          <p className="text-xs text-zinc-500 font-semibold">Catalog new tasks into specific project schedules</p>
        </div>
      </div>

      {/* FORM CARD */}
      <TaskForm onSubmit={handleSubmit} onCancel={() => navigate('/tasks')} />
    </div>
  );
}
