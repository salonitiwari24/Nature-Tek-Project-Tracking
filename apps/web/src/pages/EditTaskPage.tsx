import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowLeft,
} from 'lucide-react';

import { TaskForm } from '../components/tasks/TaskForm';

import {
  TaskDetail,
  TaskService,
} from '../services/taskService';

export default function EditTaskPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [
    task,
    setTask,
  ] =
    useState<TaskDetail | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    const loadTask =
      async () => {
        try {
          if (!id)
            return;

          const result =
            await TaskService.getTaskById(
              id
            );

          setTask(
            result
          );
        } catch (
          err
        ) {
          console.error(
            'Failed to load task:',
            err
          );

          alert(
            'Failed to load task.'
          );

          navigate(
            '/tasks'
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadTask();
  }, [id]);

  const handleSubmit =
    async (
      formData: any
    ) => {
      try {
        if (!id)
          return;

        const payload =
          {
            title:
              formData.title,

            description:
              formData.description,

            projectId:
              formData.projectId,

            stage:
              formData.category ??
              'PROJECT_CREATED',

            priority:
              formData.priority,

            status:
              formData.status,

            dueAt:
              formData.dueDate
                ? new Date(
                    formData.dueDate
                  ).toISOString()
                : undefined,
          };

        await TaskService.updateTask(
          id,
          payload
        );

        navigate(
          '/tasks'
        );
      } catch (
        err
      ) {
        console.error(
          'Failed to update task:',
          err
        );

        alert(
          'Failed to update task.'
        );
      }
    };

  if (
    loading
  ) {
    return (
      <div className="p-6 text-sm text-zinc-500">
        Loading
        task...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 text-sm text-red-500">
        Task not
        found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate(
              '/tasks'
            )
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">
            Modify Task
          </h1>

          <p className="text-xs text-zinc-500 font-semibold">
            Update task
            details and
            progress
          </p>
        </div>
      </div>

      {/* FORM */}
      <TaskForm
        initialData={
          task
        }
        onSubmit={
          handleSubmit
        }
        onCancel={() =>
          navigate(
            '/tasks'
          )
        }
      />
    </div>
  );
}