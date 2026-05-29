import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { UserDetail, UserRole } from '../../mocks/userMockData';
import { ProjectService } from '../../services/projectService';

const userFormSchema = z.object({
  name: z.string().min(3, 'User full name must be at least 3 characters'),
  email: z.string().email('Please state a valid corporate email address'),
  role: z.enum(['ADMIN', 'PROJECT_MANAGER', 'SITE_SUPERVISOR', 'ENGINEER', 'TEAM_MEMBER']),
  status: z.enum(['ACTIVE', 'SUSPENDED']),
  assignedProjects: z.array(z.string()).min(1, 'Please select at least one assigned project'),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: UserDetail | null;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export function UserForm({ initialData = null, onSubmit, onCancel }: UserFormProps) {
  const [projectsList, setProjectsList] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState<Partial<UserFormData>>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    role: initialData?.role ?? 'ENGINEER',
    status: initialData?.status ?? 'ACTIVE',
    assignedProjects: initialData?.assignedProjects ?? [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProjectsList = async () => {
      try {
        const response = await ProjectService.getProjects({ limit: 100 });
        setProjectsList(response.data.map((p) => ({ id: p.id, name: p.name })));
      } catch (err) {
        console.error('Failed to load projects list in user form:', err);
      }
    };
    loadProjectsList();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleProjectToggle = (projectId: string) => {
    setFormData((prev) => {
      const current = prev.assignedProjects ?? [];
      const updated = current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId];

      if (errors.assignedProjects) {
        setErrors((errs) => {
          const copy = { ...errs };
          delete copy.assignedProjects;
          return copy;
        });
      }

      return {
        ...prev,
        assignedProjects: updated,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = userFormSchema.safeParse(formData);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Account details */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">1. Corporate Account Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Patil"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs font-semibold text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Corporate Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. ramesh.patil@naturetek.com"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-250 focus:border-brand-500'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs font-semibold text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Functional Role <span className="text-red-500">*</span></label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
            >
              <option value="ADMIN">Admin</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="SITE_SUPERVISOR">Site Supervisor</option>
              <option value="ENGINEER">Engineer</option>
              <option value="TEAM_MEMBER">Team Member</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1.5">Status <span className="text-red-500">*</span></label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Project Mappings */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">2. Active Project Mappings <span className="text-red-500">*</span></h3>
          <p className="text-xs text-zinc-400 mt-0.5">Assign this member to one or more active regional projects</p>
        </div>

        {errors.assignedProjects && <p className="text-xs font-semibold text-red-500">{errors.assignedProjects}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-56 overflow-y-auto border border-zinc-150 p-3 rounded-lg bg-zinc-50/50">
          {projectsList.map((p) => {
            const isChecked = formData.assignedProjects?.includes(p.id) ?? false;
            return (
              <label
                key={p.id}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer text-xs font-semibold transition-all ${
                  isChecked
                    ? 'border-brand-500 bg-brand-50/20 text-brand-850'
                    : 'border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleProjectToggle(p.id)}
                  className="rounded border-zinc-350 text-brand-600 focus:ring-brand-500"
                />
                <span className="truncate">{p.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3.5 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-655 shadow-sm hover:bg-zinc-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          <Save className="h-4 w-4" />
          Save Member
        </button>
      </div>
    </form>
  );
}
