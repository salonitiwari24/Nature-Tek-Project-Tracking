import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { MilestoneDetail } from '../../mocks/milestoneMockData';
import { ProjectService } from '../../services/projectService';

const milestoneFormSchema = z.object({
  name: z.string().min(3, 'Milestone name must be at least 3 characters'),
  description: z.string().min(5, 'Description is required'),
  projectId: z.string().min(1, 'Please select a project'),
  stage: z.string().min(1, 'Please select a stage'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']),
  targetDate: z.string().min(1, 'Target date required'),
});

type MilestoneFormData = z.infer<typeof milestoneFormSchema>;

interface MilestoneFormProps {
  initialData?: MilestoneDetail | null;
  onSubmit: (data: MilestoneFormData) => void;
  onCancel: () => void;
}

export function MilestoneForm({
  initialData = null,
  onSubmit,
  onCancel,
}: MilestoneFormProps) {
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState<Partial<MilestoneFormData>>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    projectId: initialData?.projectId ?? '',
    stage: initialData?.stage ?? 'SITE_SURVEY',
    status: initialData?.status ?? 'PENDING',
    targetDate: initialData?.targetDate ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProjectsList = async () => {
      try {
        const projects = await ProjectService.getProjects({ limit: 100 });
        console.log('Projects loaded:', projects);
        setProjects(
          Array.isArray(projects)
            ? projects.map((p) => ({ id: p.id, name: p.name }))
            : []
        );
      } catch (err) {
        console.error('Failed to load projects list in milestone form:', err);
      }
    };

    loadProjectsList();
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
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

    const result = milestoneFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  };

  const lifecycleStages = [
    'PROJECT_CREATED',
    'SITE_SURVEY',
    'DESIGN_APPROVAL',
    'MATERIAL_PROCUREMENT',
    'MATERIAL_DELIVERY',
    'STRUCTURE_INSTALLATION',
    'PANEL_MOUNTING',
    'ELECTRICAL_WIRING',
    'INVERTER_CONNECTION',
    'TESTING_COMMISSIONING',
    'GRID_APPROVAL',
    'NET_METERING',
    'COMPLETED',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">
          1. Milestone Scope & Project Context
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* MILESTONE NAME */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">
              Milestone Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* PROJECT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">
              Related Project
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="">Select Project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="mt-1 text-xs text-red-500">{errors.projectId}</p>
            )}
          </div>

          {/* LIFECYCLE STAGE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">
              Lifecycle Stage
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              {lifecycleStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* MILESTONE STATUS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">
              Milestone Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>

          {/* TARGET DATE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">
              Target Date
            </label>
            <input
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            {errors.targetDate && (
              <p className="mt-1 text-xs text-red-500">{errors.targetDate}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-1 rounded-lg bg-brand-600 px-5 py-2 text-sm text-white"
        >
          <Save className="h-4 w-4" />
          Save Milestone
        </button>
      </div>
    </form>
  );
}
