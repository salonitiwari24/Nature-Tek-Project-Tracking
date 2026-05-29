import { useState, useEffect } from 'react';
import { Check, ShieldAlert, Award, ArrowRight } from 'lucide-react';
import { LIFECYCLE_STAGES, LIFECYCLE_STAGE_LABELS } from '@nature-tek/shared';
import { Project } from '../../mocks/dashboardMockData';

interface SolarWorkflowProgressWidgetProps {
  projects: Project[];
  isLoading?: boolean;
}

export function SolarWorkflowProgressWidget({
  projects,
  isLoading = false,
}: SolarWorkflowProgressWidgetProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Auto-select the first active project on load
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      // Find first ACTIVE project
      const activeProj = projects.find((p) => p.status === 'ACTIVE');
      setSelectedProjectId(activeProj ? activeProj.id : projects[0].id);
    }
  }, [projects, selectedProjectId]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="h-5 w-48 animate-pulse rounded bg-zinc-200 mb-4" />
        <div className="h-24 w-full animate-pulse rounded-lg bg-zinc-50" />
      </div>
    );
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const getStageIndex = (stage: Project['currentStage']) => {
    return LIFECYCLE_STAGES.indexOf(stage);
  };

  const activeIndex = selectedProject ? getStageIndex(selectedProject.currentStage) : 0;
  const totalStages = LIFECYCLE_STAGES.length;
  const pct = Math.round((activeIndex / (totalStages - 1)) * 100);

  const completedCount = activeIndex;
  const nextStage = activeIndex < totalStages - 1 ? LIFECYCLE_STAGE_LABELS[LIFECYCLE_STAGES[activeIndex + 1]] : 'Completed';

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Solar Lifecycle Workflow</h3>
          <p className="text-xs text-zinc-500">Track and visualize the 13-stage installation progress</p>
        </div>

        {projects.length > 0 && (
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-lg border border-zinc-250 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm outline-none transition-colors hover:border-zinc-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedProject ? (
        <div className="space-y-6">
          {/* Summary Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-zinc-50 p-4 border border-zinc-150">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Current Stage</p>
                <p className="text-sm font-bold text-zinc-900">
                  {LIFECYCLE_STAGE_LABELS[selectedProject.currentStage]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Completed Stages</p>
                <p className="text-sm font-bold text-zinc-900">
                  {completedCount} / {totalStages - 1} ({pct}% Complete)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <ArrowRight className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Upcoming Stage</p>
                <p className="text-sm font-bold text-zinc-900">{nextStage}</p>
              </div>
            </div>
          </div>

          {/* Stepper Timeline Container */}
          <div className="relative overflow-x-auto pb-4 pt-6">
            <div className="flex min-w-[1200px] justify-between relative">
              {/* Stepper line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-zinc-100 -z-10" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-brand-500 transition-all duration-500 -z-10"
                style={{ width: `${pct}%` }}
              />

              {LIFECYCLE_STAGES.map((stage, idx) => {
                const isCompleted = idx < activeIndex;
                const isActive = idx === activeIndex;
                const isFuture = idx > activeIndex;

                let circleClass = '';
                let textClass = 'text-zinc-500';

                if (isCompleted) {
                  circleClass = 'bg-brand-600 text-white border-brand-600';
                  textClass = 'text-zinc-700 font-medium';
                } else if (isActive) {
                  circleClass = 'bg-white border-indigo-600 ring-4 ring-indigo-100 text-indigo-600 scale-110';
                  textClass = 'text-indigo-700 font-bold';
                } else {
                  circleClass = 'bg-white border-zinc-200 text-zinc-400 border-dashed';
                }

                return (
                  <div key={stage} className="flex flex-col items-center w-20 text-center relative group">
                    {/* Circle Indicator */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs transition-all duration-350 ${circleClass}`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : isActive ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-ping" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Step label */}
                    <span className={`mt-3 text-[10px] tracking-tight line-clamp-2 px-1 transition-colors leading-tight ${textClass}`}>
                      {LIFECYCLE_STAGE_LABELS[stage]}
                    </span>

                    {/* Desktop micro tooltip on hover */}
                    <div className="pointer-events-none absolute bottom-12 hidden rounded bg-zinc-950 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
                      Step {idx + 1}: {LIFECYCLE_STAGE_LABELS[stage]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center text-zinc-400 text-sm">
          No projects loaded to display workflow
        </div>
      )}
    </div>
  );
}
