import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskService } from '../services/taskService';

export default function AddTaskPage() {
  const navigate = useNavigate();

  const handleSubmit = async (
    formData: any
  ) => {
    try {
      // Build backend payload
      const payload = {
        title:
          formData.title,

        description:
          formData.description,

        projectId:
          formData.projectId,

        // FIXED:
        // send actual lifecycle stage
        stage:
          formData.stage,

        priority:
          formData.priority,

        status:
          formData.status,

        // backend expects dueAt
        dueAt:
          formData.dueAt
            ? new Date(
                formData.dueAt
              ).toISOString()
            : undefined,

        assigneeId:
  formData.assigneeId ||
  undefined,

         
      };

      console.log(
        'Creating task payload:',
        payload
      );

      await TaskService.createTask(
        payload
      );

      navigate('/tasks');
    } catch (err) {
      console.error(
        'Failed to create task:',
        err
      );

      alert(
        'Failed to create task.'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate('/tasks')
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">
            Add Solar Project Task
          </h1>

          <p className="text-xs text-zinc-500 font-semibold">
            Catalog new tasks into project schedules
          </p>
        </div>
      </div>

      {/* FORM */}
      <TaskForm
        onSubmit={
          handleSubmit
        }
        onCancel={() =>
          navigate('/tasks')
        }
      />
    </div>
  );
}