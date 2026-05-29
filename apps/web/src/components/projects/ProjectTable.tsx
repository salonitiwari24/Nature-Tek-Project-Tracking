import { Link } from 'react-router-dom';
import { Eye, Edit2, AlertCircle } from 'lucide-react';
import { ProjectDetail, ProjectService } from '../../services/projectService';
import { LIFECYCLE_STAGE_LABELS } from '@nature-tek/shared';

interface ProjectTableProps {
  projects: ProjectDetail[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const getStatusBadgeClass = (status: ProjectDetail['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'COMPLETED':
        return 'bg-brand-50 text-brand-700 border border-brand-200';
      case 'ON_HOLD':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'ARCHIVED':
        return 'bg-zinc-150 text-zinc-600 border border-zinc-200';
      default:
        return 'bg-zinc-50 text-zinc-600 border border-zinc-200';
    }
  };

  const getClientTypeBadgeClass = (type: ProjectDetail['clientType']) => {
    switch (type) {
      case 'INDIVIDUAL':
        return 'bg-sky-50 text-sky-700 border border-sky-200';
      case 'CORPORATE':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'ENTERPRISE':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'GOVERNMENT':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      default:
        return 'bg-zinc-50 text-zinc-600 border border-zinc-200';
    }
  };

  const getProjectTypeBadgeClass = (type: ProjectDetail['projectType']) => {
    switch (type) {
      case 'RESIDENTIAL':
        return 'text-amber-800 bg-amber-50 border border-amber-200';
      case 'COMMERCIAL':
        return 'text-emerald-800 bg-emerald-50 border border-emerald-200';
      case 'INDUSTRIAL':
        return 'text-indigo-800 bg-indigo-50 border border-indigo-200';
      default:
        return 'text-zinc-600 bg-zinc-50 border border-zinc-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px] text-left text-sm">
        <thead className="border-b border-zinc-250 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3.5">Project ID</th>
            <th className="px-4 py-3.5">Project Name</th>
            <th className="px-4 py-3.5">Type</th>
            <th className="px-4 py-3.5">Capacity</th>
            <th className="px-4 py-3.5">Client Type</th>
            <th className="px-4 py-3.5">Location</th>
            <th className="px-4 py-3.5">Project Manager</th>
            <th className="px-4 py-3.5">Current Stage</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Progress</th>
            <th className="px-4 py-3.5 text-center">Delay</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {projects.length === 0 ? (
            <tr>
              <td colSpan={12} className="px-4 py-12 text-center text-zinc-400">
                No projects matched the search criteria or selected filters.
              </td>
            </tr>
          ) : (
            projects.map((p) => {
              const progress = ProjectService.calculateProgress(p);
              const delay = ProjectService.calculateDelayDays(p);

              return (
                <tr
                  key={p.id}
                  className={`transition-colors hover:bg-zinc-50/50 ${
                    delay > 0 ? 'bg-rose-50/20' : ''
                  }`}
                >
                  {/* Code */}
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-zinc-600">
                    {p.code}
                  </td>
                  {/* Name */}
                  <td className="px-4 py-4">
                    <Link
                      to={`/projects/${p.id}`}
                      className="font-semibold text-zinc-900 hover:text-brand-700 hover:underline transition-all"
                    >
                      {p.name}
                    </Link>
                    <span className="block text-xs text-zinc-500">{p.clientName}</span>
                  </td>
                  {/* Project Type */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium uppercase ${getProjectTypeBadgeClass(p.projectType)}`}>
                      {p.projectType}
                    </span>
                  </td>
                  {/* Capacity */}
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-zinc-950">
                    {p.capacityKw >= 1000
                      ? `${(p.capacityKw / 1000).toFixed(1)} MW`
                      : `${p.capacityKw} kW`}
                  </td>
                  {/* Client Type */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${getClientTypeBadgeClass(p.clientType)}`}>
                      {p.clientType}
                    </span>
                  </td>
                  {/* Location */}
                  <td className="px-4 py-4 text-zinc-600">
                    {p.siteCity}, {p.siteState}
                  </td>
                  {/* PM */}
                  <td className="px-4 py-4 font-medium text-zinc-700">
                    {p.pmName}
                  </td>
                  {/* Current Stage */}
                  <td className="px-4 py-4 text-xs font-medium text-zinc-500">
                    {LIFECYCLE_STAGE_LABELS[p.currentStage]}
                  </td>
                  {/* Status */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  {/* Derived Progress */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            p.status === 'COMPLETED'
                              ? 'bg-brand-500'
                              : p.status === 'ON_HOLD'
                                ? 'bg-amber-400'
                                : delay > 0
                                  ? 'bg-red-500'
                                  : 'bg-indigo-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-zinc-700">{progress}%</span>
                    </div>
                  </td>
                  {/* Delay Days */}
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    {delay > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-xs font-bold text-rose-700">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {delay}d
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 font-medium">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/projects/${p.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        to={`/projects/${p.id}/edit`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                        title="Edit Project"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
