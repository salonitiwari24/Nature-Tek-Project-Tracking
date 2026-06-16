import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { ProjectService } from '../../services/projectService';
import { UserService } from '../../services/userService';

// Change 1: assigneeId added to schema
const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Task name must be at least 3 characters'),

  description: z.string().optional(),

  projectId: z
    .string()
    .min(1, 'Please select a project'),

  stage: z.string().min(1, 'Stage is required'),

  priority: z.enum([
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT',
  ]),

  status: z.enum([
    'NOT_STARTED',
    'IN_PROGRESS',
    'BLOCKED',
    'IN_REVIEW',
    'DONE',
    'CANCELLED',
  ]),

  assigneeId: z.string().optional(),

  dueAt: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  initialData?: any;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export function TaskForm({
  initialData = null,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [projectsList, setProjectsList] = useState<
    { id: string; name: string }[]
  >([]);

  const [usersList, setUsersList] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  // Change 2: assigneeId added to formData state
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    projectId: initialData?.projectId ?? '',
    assigneeId: initialData?.assigneeId ?? '',
    stage: initialData?.stage ?? 'PROJECT_CREATED',
    priority: initialData?.priority ?? 'MEDIUM',
    status: initialData?.status ?? 'NOT_STARTED',
    dueAt: initialData?.dueAt?.split('T')[0] ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Change 3: loadUsers added to existing useEffect
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await ProjectService.getProjects({ limit: 100 });
        setProjectsList(
          Array.isArray(projects)
            ? projects.map((p) => ({ id: p.id, name: p.name }))
            : []
        );
      } catch (err) {
        console.error('Failed to load projects:', err);
        setProjectsList([]);
      }
    };

    const loadUsers = async () => {
      try {
        const users = await UserService.getUsers({ limit: 100 });
        setUsersList(
          users.data.map((u) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
          }))
        );
      } catch (err) {
        console.error('Failed to load users:', err);
        setUsersList([]);
      }
    };

    loadProjects();
    loadUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Save clicked');

    const result = taskFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      console.log(fieldErrors);
      setErrors(fieldErrors);
      return;
    }

    onSubmit({
      ...result.data,
      dueAt: result.data.dueAt
        ? new Date(result.data.dueAt).toISOString()
        : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-700">
          Task Details
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          {/* TASK NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Task Name
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* PROJECT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Project
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="">Select Project</option>
              {projectsList.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="mt-1 text-xs text-red-500">{errors.projectId}</p>
            )}
          </div>

          {/* Change 4: ASSIGNED TO dropdown, placed right after PROJECT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Assigned To
            </label>
            <select
              name="assigneeId"
              value={formData.assigneeId ?? ''}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="">Unassigned</option>
              {usersList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* STAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Stage
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="PROJECT_CREATED">Project Created</option>
              <option value="SITE_SURVEY">Site Survey</option>
              <option value="DESIGN_APPROVAL">Design Approval</option>
              <option value="MATERIAL_PROCUREMENT">Material Procurement</option>
              <option value="MATERIAL_DELIVERY">Material Delivery</option>
              <option value="STRUCTURE_INSTALLATION">Structure Installation</option>
              <option value="PANEL_MOUNTING">Panel Mounting</option>
              <option value="ELECTRICAL_WIRING">Electrical Wiring</option>
              <option value="INVERTER_INSTALLATION">Inverter Installation</option>
              <option value="TESTING_COMMISSIONING">Testing & Commissioning</option>
              <option value="GRID_APPROVAL">Grid Approval</option>
              <option value="PROJECT_HANDOVER">Project Handover</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* PRIORITY */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="NOT_STARTED">NOT_STARTED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="DONE">DONE</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* DUE DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueAt"
              value={formData.dueAt ?? ''}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-5">
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description ?? ''}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border px-4 py-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-white"
        >
          <Save className="h-4 w-4" />
          Save Task
        </button>
      </div>
    </form>
  );
}