import { Link } from 'react-router-dom';
import { MapPin, User, Calendar, Settings, AlertTriangle } from 'lucide-react';
import { ProjectDetail, ProjectService } from '../../services/projectService';
import { LIFECYCLE_STAGE_LABELS } from '@nature-tek/shared';

interface ProjectCardProps {
  project: ProjectDetail;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = ProjectService.calculateProgress(project);
  const delay = ProjectService.calculateDelayDays(project);

  const getStatusStyle = (status: ProjectDetail['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'COMPLETED':
        return 'bg-brand-50 text-brand-700 border-brand-100';
      case 'ON_HOLD':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-zinc-50 text-zinc-600 border-zinc-150';
    }
  };

  const getProjectTypeStyle = (type: ProjectDetail['projectType']) => {
    switch (type) {
      case 'RESIDENTIAL':
        return 'text-amber-800 bg-amber-50';
      case 'COMMERCIAL':
        return 'text-emerald-800 bg-emerald-50';
      case 'INDUSTRIAL':
        return 'text-indigo-800 bg-indigo-50';
      default:
        return 'text-zinc-600 bg-zinc-50';
    }
  };

  return (
    <div className="relative flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs font-semibold text-zinc-400">{project.code}</span>
        <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${getProjectTypeStyle(project.projectType)}`}>
          {project.projectType}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-2 text-base font-bold text-zinc-950 line-clamp-1">
        <Link to={`/projects/${project.id}`} className="hover:text-brand-700 hover:underline">
          {project.name}
        </Link>
      </h3>
      <p className="text-xs text-zinc-500 mt-0.5 font-medium">{project.clientName}</p>

      {/* Divider */}
      <hr className="my-3.5 border-zinc-150" />

      {/* Meta parameters */}
      <div className="grid grid-cols-2 gap-y-2.5 text-xs text-zinc-600">
        <div className="flex items-center gap-1.5 min-w-0">
          <Settings className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="truncate font-semibold text-zinc-900">
            {project.capacityKw >= 1000 ? `${(project.capacityKw / 1000).toFixed(1)} MW` : `${project.capacityKw} kW`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="truncate">{project.siteCity}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <User className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="truncate">{project.pmName}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="truncate">End: {project.targetEnd}</span>
        </div>
      </div>

      {/* Status & Stage */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-500">Current Stage:</span>
          <span className="font-bold text-zinc-800 truncate pl-2">
            {LIFECYCLE_STAGE_LABELS[project.currentStage]}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(project.status)}`}>
            {project.status}
          </span>
          {delay > 0 && (
            <span className="flex items-center gap-1 rounded bg-rose-50 border border-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
              <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
              {delay}d Delayed
            </span>
          )}
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-500 mb-1">
          <span>Overall Progress</span>
          <span className="text-zinc-700">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              project.status === 'COMPLETED'
                ? 'bg-brand-500'
                : project.status === 'ON_HOLD'
                  ? 'bg-amber-400'
                  : delay > 0
                    ? 'bg-red-500'
                    : 'bg-indigo-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
