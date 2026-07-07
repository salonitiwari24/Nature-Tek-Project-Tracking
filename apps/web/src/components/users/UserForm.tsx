import { useState } from 'react';
import { z } from 'zod';
import { Save, X } from 'lucide-react';

const userFormSchema = z.object({
  firstName: z
    .string()
    .min(
      2,
      'First name must be at least 2 characters'
    ),

  lastName: z
    .string()
    .min(
      2,
      'Last name must be at least 2 characters'
    ),

  email: z
    .string()
    .email(
      'Please enter a valid email'
    ),

  role: z.enum([
    'ADMIN',
    'PM',
    'SUPERVISOR',
    'MEMBER',
    'EXEC',
    'DESIGN',
    'PROCUREMENT',
    'QA',
    'FINANCE',
    'CLIENT',
    'SERVICE',
  ]),

  isActive:
    z.boolean(),
});

type UserFormData =
  z.infer<
    typeof userFormSchema
  >;

interface UserFormProps {
  initialData?: any;

  onSubmit: (
    data: UserFormData
  ) => void;

  onCancel: () => void;
}

export function UserForm({
  initialData = null,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [
    formData,
    setFormData,
  ] = useState<
    Partial<UserFormData>
  >({
    firstName:
      initialData?.firstName ??
      '',

    lastName:
      initialData?.lastName ??
      '',

    email:
      initialData?.email ??
      '',

    role:
      initialData?.role ??
      'MEMBER',

    isActive:
      initialData?.isActive ??
      true,
  });

  const [
    errors,
    setErrors,
  ] = useState<
    Record<string, string>
  >({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,

        [name]:
          name ===
          'isActive'
            ? value ===
              'true'
            : value,
      })
    );

    if (
      errors[name]
    ) {
      setErrors(
        (
          prev
        ) => {
          const copy =
            {
              ...prev,
            };

          delete copy[
            name
          ];

          return copy;
        }
      );
    }
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const result =
      userFormSchema.safeParse(
        formData
      );

    if (
      !result.success
    ) {
      const fieldErrors: Record<
        string,
        string
      > = {};

      result.error.issues.forEach(
        (
          issue
        ) => {
          const path =
            issue.path[0] as string;

          fieldErrors[
            path
          ] =
            issue.message;
        }
      );

      setErrors(
        fieldErrors
      );

      return;
    }

    onSubmit(
      result.data
    );
  };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-6"
    >
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-brand-700">
          Team Member
          Details
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* FIRST NAME */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              value={
                formData.firstName
              }
              onChange={
                handleChange
              }
              className="w-full rounded-lg border px-3 py-2"
            />

            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">
                {
                  errors.firstName
                }
              </p>
            )}
          </div>

          {/* LAST NAME */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={
                formData.lastName
              }
              onChange={
                handleChange
              }
              className="w-full rounded-lg border px-3 py-2"
            />

            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">
                {
                  errors.lastName
                }
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className="w-full rounded-lg border px-3 py-2"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {
                  errors.email
                }
              </p>
            )}
          </div>

          {/* ROLE */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase">
              Role
            </label>

            <select
              name="role"
              value={
                formData.role
              }
              onChange={
                handleChange
              }
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="ADMIN">
                Admin
              </option>

              <option value="PM">
                Project
                Manager
              </option>

              <option value="SUPERVISOR">
                Supervisor
              </option>

              <option value="ENGINEER">
                Engineer
              </option>

              <option value="MEMBER">
                Team
                Member
              </option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase">
              Status
            </label>

            <select
              name="isActive"
              value={String(
                formData.isActive
              )}
              onChange={
                handleChange
              }
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={
            onCancel
          }
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
          Save User
        </button>
      </div>
    </form>
  );
}