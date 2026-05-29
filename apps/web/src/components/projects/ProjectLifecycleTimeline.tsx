import { Check, ShieldAlert, Zap } from 'lucide-react';
import { LIFECYCLE_STAGES, LIFECYCLE_STAGE_LABELS } from '@nature-tek/shared';
import { ProjectDetail } from '../../services/projectService';

interface ProjectLifecycleTimelineProps {
  project: ProjectDetail;
  onAdvanceStage?: (newStage: ProjectDetail['currentStage']) => void;
}

export function ProjectLifecycleTimeline({ project, onAdvanceStage }: ProjectLifecycleTimelineProps) {
  const currentStageIndex = LIFECYCLE_STAGES.indexOf(project.currentStage);

  const handleAdvance = () => {
    if (currentStageIndex < LIFECYCLE_STAGES.length - 1 && onAdvanceStage) {
      const nextStage = LIFECYCLE_STAGES[currentStageIndex + 1] as ProjectDetail['currentStage'];
      onAdvanceStage(nextStage);
    }
  };

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'PROJECT_CREATED':
        return 'Project charter signed off and initial PM/Supervisor assigned.';
      case 'SITE_SURVEY':
        return 'Site measurements, solar irradiation reports, and geotechnical analysis.';
      case 'DESIGN_APPROVAL':
        return 'Single-line CAD drawings and protection relay configurations.';
      case 'MATERIAL_PROCUREMENT':
        return 'Procurement orders issued for panels, racking structures, and inverters.';
      case 'MATERIAL_DELIVERY':
        return 'Transit logistics and material inspection at the site yard.';
      case 'STRUCTURE_INSTALLATION':
        return 'Ballasted racking systems or anchor roof rail installation.';
      case 'PANEL_MOUNTING':
        return 'Clamping bifacial/monocrystalline panels onto racking arrays.';
      case 'ELECTRICAL_WIRING':
        return 'Routing high-voltage DC runs through conduits to inverter terminals.';
      case 'INVERTER_INSTALLATION':
        return 'Mounting wall-hung hybrid/string inverters and synchronizing relays.';
      case 'TESTING_COMMISSIONING':
        return 'Performing grounding impedance checks and insulation diagnostic testing.';
      case 'GRID_APPROVAL':
        return 'CEIG inspectors sign-off and utility net metering integration.';
      case 'PROJECT_HANDOVER':
        return 'Warranty manuals, O&M protocols, and client dashboard handover.';
      case 'COMPLETED':
        return 'Active generation feeding the customer load and regional utility grid.';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-150 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-zinc-950">Lifecycle Timeline</h3>
          <p className="text-xs text-zinc-500">13-stage Nature Tek Solar tracker</p>
        </div>

        {currentStageIndex < LIFECYCLE_STAGES.length - 1 && onAdvanceStage && project.status === 'ACTIVE' && (
          <button
            onClick={handleAdvance}
            className="flex items-center gap-1 rounded bg-indigo-50 border border-indigo-200 px-2 py-1 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100"
          >
            <Zap className="h-3.5 w-3.5 shrink-0" />
            Advance Stage
          </button>
        )}
      </div>

      <div className="relative pl-6 space-y-5 border-l border-zinc-150">
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;
          const isFuture = idx > currentStageIndex;

          let bulletClass = '';
          let textClass = '';

          if (isCompleted) {
            bulletClass = 'bg-brand-600 text-white border-brand-600';
            textClass = 'text-zinc-800';
          } else if (isActive) {
            bulletClass = 'bg-white border-indigo-600 ring-4 ring-indigo-50 text-indigo-600 font-bold';
            textClass = 'text-indigo-950';
          } else {
            bulletClass = 'bg-white border-zinc-200 text-zinc-400 border-dashed';
            textClass = 'text-zinc-400';
          }

          return (
            <div key={stage} className="relative group">
              {/* Bullet Circle Indicator */}
              <div
                className={`absolute -left-[35px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] transition-all ${bulletClass}`}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3" />
                ) : isActive ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                  </span>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Stage content */}
              <div>
                <h4 className={`text-xs font-bold tracking-tight leading-none ${isActive ? 'text-sm font-extrabold text-indigo-700' : textClass}`}>
                  {LIFECYCLE_STAGE_LABELS[stage]}
                </h4>
                
                {/* Expand active stage description */}
                {isActive && (
                  <div className="mt-1.5 rounded-lg border border-indigo-100 bg-indigo-50/30 p-2.5">
                    <p className="text-[11px] leading-relaxed text-indigo-950">
                      {getStageDescription(stage)}
                    </p>
                    {/* Tiny inline checklist */}
                    <div className="mt-2 space-y-1 text-[10px] text-indigo-900/80">
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 shrink-0 text-brand-650" />
                        <span>Pre-requisite stage approvals verified</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 shrink-0 text-brand-650" />
                        <span>Documents and materials cataloged</span>
                      </div>
                    </div>
                  </div>
                )}

                {!isActive && (
                  <p className="mt-0.5 text-[10px] leading-snug text-zinc-400 group-hover:text-zinc-500 transition-colors">
                    {isCompleted ? 'Completed milestone gate' : 'Upcoming installation task'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
