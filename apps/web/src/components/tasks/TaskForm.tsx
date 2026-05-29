import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { TaskDetail, TaskCategory, TaskStatus, TaskPriority } from '../../mocks/taskMockData';
import { ProjectService } from '../../services/projectService';

// Zod form validation schema for tasks (Requirement 3: Task Category field added)
const taskFormSchema = z
  .object({
    title: z.string().min(3, 'Task name must be at least 3 characters'),
    description: z.string().optional(),
    projectId: z.string().min(1, 'Please select a related project'),
    category: z.enum(['SURVEY', 'DESIGN', 'PROCUREMENT', 'INSTALLATION', 'ELECTRICAL', 'TESTING', 'DOCUMENTATION', 'APPROVAL']),
    assigneeName: z.string().min(2, 'Assignee name is required'),
    assigneeRole: z.string().min(2, 'Assignee role is required'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'DONE', 'CANCELLED']),
    startDate: z.string().min(10, 'Start date is required'),
    dueDate: z.string().min(10, 'Due date is required'),
    estimatedHours: z
      .number({ invalid_type_error: 'Estimated hours must be a number' })
      .positive('Estimated hours must be greater than 0'),
    progress: z.number().min(0).max(100).default(0),
  })
  .refine((data) => new Date(data.dueDate) >= new Date(data.startDate), {
    message: 'Due date must be after or on the start date',
    path: ['dueDate'],
  });

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  initialData?: TaskDetail | null;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export function TaskForm({ initialData = null, onSubmit, onCancel }: TaskFormProps) {
  const [projectsList, setProjectsList] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState<Partial<TaskFormData>>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    projectId: initialData?.projectId ?? '',
    category: initialData?.category ?? 'SURVEY',
    assigneeName: initialData?.assigneeName ?? '',
    assigneeRole: initialData?.assigneeRole ?? 'SITE_SUPERVISOR',
    priority: initialData?.priority ?? 'MEDIUM',
    status: initialData?.status ?? 'NOT_STARTED',
    startDate: initialData?.startDate ?? '',
    dueDate: initialData?.dueDate ?? '',
    estimatedHours: initialData?.estimatedHours ?? 0,
    progress: initialData?.progress ?? 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await ProjectService.getProjects({ limit: 100 });
        setProjectsList(response.data.map((p) => ({ id: p.id, name: p.name })));
      } catch (err) {
        console.error('Failed to load projects list in form:', err);
      }
    };
    loadProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));

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

    const dataToValidate = {
      ...formData,
      estimatedHours: Number(formData.estimatedHours),
      progress: Number(formData.progress),
    };

    const result = taskFormSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      
      const firstErrorKey = Object.keys(fieldErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECTION 1: TASK SCOPE */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-4">1. Task Scope & Project Allocation</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Task Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Geotechnical soil compaction tests"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.title ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs font-semibold text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="projectId" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Related Project <span className="text-red-500">*</span></label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.projectId ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            >
              <option value="">Select Project...</option>
              {projectsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="mt-1 text-xs font-semibold text-red-500">{errors.projectId}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Task Category <span className="text-red-500">*</span></label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
            >
              <option value="SURVEY">Survey</option>
              <option value="DESIGN">Design</option>
              <option value="PROCUREMENT">Procurement</option>
              <option value="INSTALLATION">Installation</option>
              <option value="ELECTRICAL">Electrical</option>
              <option value="TESTING">Testing</option>
              <option value="DOCUMENTATION">Documentation</option>
              <option value="APPROVAL">Approval</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Task Priority <span className="text-red-500">*</span></label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Task Status <span className="text-red-500">*</span></label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="BLOCKED">Blocked</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: ASSIGNEE & SCHEDULE */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-4">2. Assignee & Schedule</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="assigneeName" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Assignee Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="assigneeName"
              name="assigneeName"
              value={formData.assigneeName}
              onChange={handleChange}
              placeholder="e.g. Ramesh Gore"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.assigneeName ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.assigneeName && <p className="mt-1 text-xs font-semibold text-red-500">{errors.assigneeName}</p>}
          </div>

          <div>
            <label htmlFor="assigneeRole" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Assignee Role <span className="text-red-500">*</span></label>
            <select
              id="assigneeRole"
              name="assigneeRole"
              value={formData.assigneeRole}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
            >
              <option value="SITE_SUPERVISOR">Site Supervisor</option>
              <option value="DESIGN_ENGINEER">Design Engineer</option>
              <option value="PROCUREMENT_OFFICER">Procurement Coordinator</option>
              <option value="QA_INSPECTOR">Quality Inspector</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Start Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.startDate ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.startDate && <p className="mt-1 text-xs font-semibold text-red-500">{errors.startDate}</p>}
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Due Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.dueDate ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.dueDate && <p className="mt-1 text-xs font-semibold text-red-500">{errors.dueDate}</p>}
          </div>

          <div>
            <label htmlFor="estimatedHours" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Estimated Hours <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="estimatedHours"
              name="estimatedHours"
              value={formData.estimatedHours === 0 ? '' : formData.estimatedHours}
              onChange={handleChange}
              placeholder="e.g. 16"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.estimatedHours ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.estimatedHours && <p className="mt-1 text-xs font-semibold text-red-500">{errors.estimatedHours}</p>}
          </div>

          {initialData && (
            <div>
              <label htmlFor="progress" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Task Progress %</label>
              <input
                type="number"
                min="0"
                max="100"
                id="progress"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-250 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: DESCRIPTION */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Scope Narrative Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Write technical steps to execute, tools required, or material constraints..."
          className="w-full rounded-lg border border-zinc-250 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3.5 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Save className="h-4 w-4" />
          Save Task
        </button>
      </div>
    </form>
  );
}
