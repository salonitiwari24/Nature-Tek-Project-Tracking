import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { MilestoneDetail, MilestoneCategory, MilestoneStatus } from '../../mocks/milestoneMockData';
import { ProjectService } from '../../services/projectService';

// Zod form validation schema for milestones (incorporates stage mapping and 9 categories)
const milestoneFormSchema = z.object({
  name: z.string().min(3, 'Milestone name must be at least 3 characters'),
  description: z.string().min(5, 'Scope description must be documented'),
  projectId: z.string().min(1, 'Please select a related project'),
  stage: z.string().min(1, 'Please select a corresponding lifecycle stage'),
  category: z.enum(['SURVEY', 'DESIGN', 'PROCUREMENT', 'INSTALLATION', 'ELECTRICAL', 'TESTING', 'DOCUMENTATION', 'APPROVAL', 'HANDOVER']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']),
  targetDate: z.string().min(10, 'Target date is required'),
});

type MilestoneFormData = z.infer<typeof milestoneFormSchema>;

interface MilestoneFormProps {
  initialData?: MilestoneDetail | null;
  onSubmit: (data: MilestoneFormData) => void;
  onCancel: () => void;
}

export function MilestoneForm({ initialData = null, onSubmit, onCancel }: MilestoneFormProps) {
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState<Partial<MilestoneFormData>>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    projectId: initialData?.projectId ?? '',
    stage: initialData?.stage ?? 'SITE_SURVEY',
    category: initialData?.category ?? 'SURVEY',
    status: initialData?.status ?? 'PENDING',
    targetDate: initialData?.targetDate ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProjectsList = async () => {
      try {
        const response = await ProjectService.getProjects({ limit: 100 });
        setProjects(response.data.map((p) => ({ id: p.id, name: p.name })));
      } catch (err) {
        console.error('Failed to load projects list in milestone form:', err);
      }
    };
    loadProjectsList();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  // 13 stages declared in projectTimelines
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
      {/* SCOPE & PROJECTS */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">1. Milestone Scope & Project Context</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Milestone Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Utility Grid Bidirectional Synchronized test"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs font-semibold text-red-500">{errors.name}</p>}
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
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="mt-1 text-xs font-semibold text-red-500">{errors.projectId}</p>}
          </div>

          <div>
            <label htmlFor="stage" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Lifecycle Stage Mapping <span className="text-red-500">*</span></label>
            <select
              id="stage"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.stage ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            >
              {lifecycleStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {errors.stage && <p className="mt-1 text-xs font-semibold text-red-500">{errors.stage}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Milestone Category <span className="text-red-500">*</span></label>
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
              <option value="HANDOVER">Handover</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Milestone Status <span className="text-red-500">*</span></label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
            >
              <option value="PENDING">Pending / Awaiting</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* TIMELINE & SCHEDULING */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">2. Scheduling Gates</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="targetDate" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Target Completion Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              id="targetDate"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.targetDate ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.targetDate && <p className="mt-1 text-xs font-semibold text-red-500">{errors.targetDate}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Scope Narrative & Technical Gate Criteria <span className="text-red-500">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="State precise inspections parameters or regulatory documents needed to sign-off this milestone..."
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.description ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.description && <p className="mt-1 text-xs font-semibold text-red-500">{errors.description}</p>}
          </div>
        </div>
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
          Save Milestone
        </button>
      </div>
    </form>
  );
}
