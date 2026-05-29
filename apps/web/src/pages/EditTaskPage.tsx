import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskService, TaskDetail } from '../services/taskService';

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTaskData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await TaskService.getTaskById(id);
        setTask(data);
      } catch (err) {
        console.error('Error pre-loading task spec:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTaskData();
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    try {
      await TaskService.updateTask(id, data);
      navigate(`/tasks/${id}`);
    } catch (err) {
      console.error('Failed to update task:', err);
      alert('An error occurred while saving the task updates.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12 rounded-xl border border-zinc-200 bg-white">
        <p className="text-sm font-semibold text-zinc-500">Task specifications not found.</p>
        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
        >
          Back to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/tasks/${id}`)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">Modify Task: {task.id}</h1>
          <p className="text-xs text-zinc-500 font-semibold">Update priority, status, assignee, or parameters</p>
        </div>
      </div>

      {/* FORM CARD */}
      <TaskForm initialData={task} onSubmit={handleSubmit} onCancel={() => navigate(`/tasks/${id}`)} />
    </div>
  );
}
