import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { ProjectDetail } from '../../services/projectService';
import { UserDetail, UserService } from '../../services/userService';

// Zod form validation schema
const projectFormSchema = z
  .object({
    name: z.string().min(3, 'Project name must be at least 3 characters'),
    projectType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL']),
    clientType: z.enum(['INDIVIDUAL', 'CORPORATE', 'GOVERNMENT', 'ENTERPRISE']),
    capacityKw: z.number({ invalid_type_error: 'Capacity must be a number' }).positive('Capacity must be greater than 0 kW'),
    clientName: z.string().min(2, 'Client name must be at least 2 characters'),
    clientEmail: z.string().email('Please enter a valid client email address'),
    clientPhone: z.string().min(10, 'Client phone must be at least 10 digits'),
    siteAddress: z.string().min(5, 'Site address must be at least 5 characters'),
    siteCity: z.string().min(2, 'Site city is required'),
    siteState: z.string().min(2, 'Site state is required (e.g. MH)'),
    pmId: z.string().min(1, 'Project Manager is required'),
    supervisorId: z.string().min(1, 'Supervisor is required'),
    targetStart: z.string().min(10, 'Start date is required'),
    targetEnd: z.string().min(10, 'Expected end date is required'),
    budget: z.number({ invalid_type_error: 'Budget must be a number' }).positive('Budget must be greater than 0'),
    description: z.string().min(10, 'Please write a brief project description (min 10 chars)'),
  })
  .refine((data) => new Date(data.targetEnd) > new Date(data.targetStart), {
    message: 'Expected end date must be after start date',
    path: ['targetEnd'],
  });

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  initialData?: ProjectDetail | null;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

export function ProjectForm({ initialData = null, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<ProjectFormData>>({
    name: initialData?.name ?? '',
    projectType: initialData?.projectType ?? 'RESIDENTIAL',
    clientType: initialData?.clientType ?? 'INDIVIDUAL',
    capacityKw: initialData?.capacityKw ?? 0,
    clientName: initialData?.clientName ?? '',
    clientEmail: initialData?.clientEmail ?? '',
    clientPhone: initialData?.clientPhone ?? '',
    siteAddress: initialData?.siteAddress ?? '',
    siteCity: initialData?.siteCity ?? '',
    siteState: initialData?.siteState ?? 'MH',
    pmId: initialData?.pmId ?? '',
    supervisorId: initialData?.supervisorId ?? '',
    targetStart: initialData?.targetStart ?? '',
    targetEnd: initialData?.targetEnd ?? '',
    budget: initialData?.budget ?? 0,
    description: initialData?.description ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projectManagers, setProjectManagers] = useState<UserDetail[]>([]);
  const [supervisors, setSupervisors] = useState<UserDetail[]>([]);
  const [isLoadingAssignees, setIsLoadingAssignees] = useState<boolean>(true);

  useEffect(() => {
    const loadAssignees = async () => {
      setIsLoadingAssignees(true);

      try {
        const [pmData, supervisorData] = await Promise.all([
          UserService.getPMs(),
          UserService.getSupervisors(),
        ]);

        setProjectManagers(pmData.filter((u) => u.isActive));
        setSupervisors(supervisorData.filter((u) => u.isActive));
      } catch (err) {
        console.error('Failed to load project assignees:', err);
      } finally {
        setIsLoadingAssignees(false);
      }
    };

    loadAssignees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));

    // Clear error on change
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

    // Parse values in correct types before running Zod check
    const dataToValidate = {
      ...formData,
      capacityKw: Number(formData.capacityKw),
      budget: Number(formData.budget),
    };

    const result = projectFormSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      
      // Scroll to the first error
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
      {/* SECTION 1: SYSTEM PARAMETERS */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-4">1. Solar Array Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Project Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Mesa Verde Residential Grid"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.name ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs font-semibold text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="capacityKw" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Capacity (kW) <span className="text-red-500">*</span></label>
            <input
              type="number"
              step="any"
              id="capacityKw"
              name="capacityKw"
              value={formData.capacityKw === 0 ? '' : formData.capacityKw}
              onChange={handleChange}
              placeholder="e.g. 12.5"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.capacityKw ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.capacityKw && <p className="mt-1 text-xs font-semibold text-red-500">{errors.capacityKw}</p>}
          </div>

          <div>
            <label htmlFor="projectType" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Project Type <span className="text-red-500">*</span></label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
            >
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="INDUSTRIAL">Industrial</option>
            </select>
          </div>

          <div>
            <label htmlFor="clientType" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Client Type <span className="text-red-500">*</span></label>
            <select
              id="clientType"
              name="clientType"
              value={formData.clientType}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
            >
              <option value="INDIVIDUAL">Individual</option>
              <option value="CORPORATE">Corporate</option>
              <option value="GOVERNMENT">Government</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </div>

          <div>
            <label htmlFor="budget" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Budget (₹) <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget === 0 ? '' : formData.budget}
              onChange={handleChange}
              placeholder="e.g. 650000"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.budget ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.budget && <p className="mt-1 text-xs font-semibold text-red-500">{errors.budget}</p>}
          </div>
        </div>
      </div>

      {/* SECTION 2: CLIENT DETAILS */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-4">2. Client Contacts</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="clientName" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Client Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="e.g. Robert Vance"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.clientName ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.clientName && <p className="mt-1 text-xs font-semibold text-red-500">{errors.clientName}</p>}
          </div>

          <div>
            <label htmlFor="clientEmail" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Client Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              placeholder="e.g. bob@vance.com"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.clientEmail ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.clientEmail && <p className="mt-1 text-xs font-semibold text-red-500">{errors.clientEmail}</p>}
          </div>

          <div>
            <label htmlFor="clientPhone" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Client Phone <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="clientPhone"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              placeholder="e.g. +91 98230 11223"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.clientPhone ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.clientPhone && <p className="mt-1 text-xs font-semibold text-red-500">{errors.clientPhone}</p>}
          </div>
        </div>
      </div>

      {/* SECTION 3: LOCATION & PM */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-4">3. Site Location & Assignee</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-3">
            <label htmlFor="siteAddress" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Site Address <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="siteAddress"
              name="siteAddress"
              value={formData.siteAddress}
              onChange={handleChange}
              placeholder="e.g. Block C-4, Kalyani Nagar"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.siteAddress ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.siteAddress && <p className="mt-1 text-xs font-semibold text-red-500">{errors.siteAddress}</p>}
          </div>

          <div>
            <label htmlFor="siteCity" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">City <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="siteCity"
              name="siteCity"
              value={formData.siteCity}
              onChange={handleChange}
              placeholder="e.g. Pune"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.siteCity ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.siteCity && <p className="mt-1 text-xs font-semibold text-red-500">{errors.siteCity}</p>}
          </div>

          <div>
            <label htmlFor="siteState" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">State <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="siteState"
              name="siteState"
              value={formData.siteState}
              onChange={handleChange}
              placeholder="e.g. MH"
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.siteState ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.siteState && <p className="mt-1 text-xs font-semibold text-red-500">{errors.siteState}</p>}
          </div>

          <div>
            <label htmlFor="pmId" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Project Manager <span className="text-red-500">*</span></label>
            <select
              id="pmId"
              name="pmId"
              value={formData.pmId}
              onChange={handleChange}
              disabled={isLoadingAssignees}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.pmId ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            >
              <option value="">{isLoadingAssignees ? 'Loading project managers...' : 'Select project manager'}</option>
              {projectManagers.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.firstName} {pm.lastName}
                </option>
              ))}
            </select>
            {errors.pmId && <p className="mt-1 text-xs font-semibold text-red-500">{errors.pmId}</p>}
          </div>

          <div>
            <label htmlFor="supervisorId" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Supervisor <span className="text-red-500">*</span></label>
            <select
              id="supervisorId"
              name="supervisorId"
              value={formData.supervisorId}
              onChange={handleChange}
              disabled={isLoadingAssignees}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.supervisorId ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            >
              <option value="">{isLoadingAssignees ? 'Loading supervisors...' : 'Select supervisor'}</option>
              {supervisors.map((supervisor) => (
                <option key={supervisor.id} value={supervisor.id}>
                  {supervisor.firstName} {supervisor.lastName}
                </option>
              ))}
            </select>
            {errors.supervisorId && <p className="mt-1 text-xs font-semibold text-red-500">{errors.supervisorId}</p>}
          </div>
        </div>
      </div>

      {/* SECTION 4: SCHEDULE & DETAILS */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-4">4. Project Schedule & Narrative</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="targetStart" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Target Start Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              id="targetStart"
              name="targetStart"
              value={formData.targetStart}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.targetStart ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.targetStart && <p className="mt-1 text-xs font-semibold text-red-500">{errors.targetStart}</p>}
          </div>

          <div>
            <label htmlFor="targetEnd" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Expected End Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              id="targetEnd"
              name="targetEnd"
              value={formData.targetEnd}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.targetEnd ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
              }`}
            />
            {errors.targetEnd && <p className="mt-1 text-xs font-semibold text-red-500">{errors.targetEnd}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wide text-zinc-600 mb-1.5">Description <span className="text-red-500">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="e.g. Project details, constraints, racking specifications..."
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
                errors.description ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-zinc-250 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
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
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Save className="h-4 w-4" />
          Save Project
        </button>
      </div>
    </form>
  );
}
