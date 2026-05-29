import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, AlertTriangle, CheckCircle2, ShieldAlert, Layers, ExternalLink, Calendar, CheckSquare } from 'lucide-react';
import { MilestoneDetail, MilestoneService } from '../services/milestoneService';
import { MilestoneStatusBadge } from '../components/milestones/MilestoneStatusBadge';
import { MilestoneTimeline } from '../components/milestones/MilestoneTimeline';
import { MilestoneDependencies } from '../components/milestones/MilestoneDependencies';
import { TaskService } from '../services/taskService';
import { TaskDetail } from '../mocks/taskMockData';

export default function MilestoneDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [milestone, setMilestone] = useState<MilestoneDetail | null>(null);
  const [projectHealth, setProjectHealth] = useState<'ON_TRACK' | 'AT_RISK' | 'DELAYED'>('ON_TRACK');
  const [childTasks, setChildTasks] = useState<TaskDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadMilestoneDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await MilestoneService.getMilestoneById(id);
      if (data) {
        setMilestone(data);
        
        // Derive Project Health dynamically (Requirement 2 & 5)
        const health = await MilestoneService.deriveProjectHealth(data.projectId);
        setProjectHealth(health);

        // Fetch related child tasks matching project and stage for cascading checks (Requirement 4)
        const tasksResult = await TaskService.getTasks({
          projectId: data.projectId,
          limit: 100,
        });
        const matched = tasksResult.data.filter((t) => t.stage === data.stage);
        setChildTasks(matched);
      }
    } catch (err) {
      console.error('Error fetching milestone details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestoneDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
      </div>
    );
  }

  if (!milestone) {
    return (
      <div className="text-center py-12 rounded-xl border border-zinc-250 bg-white">
        <p className="text-sm font-semibold text-zinc-500">Milestone details could not be found.</p>
        <button
          type="button"
          onClick={() => navigate('/milestones')}
          className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
        >
          Back to Ledger
        </button>
      </div>
    );
  }

  const isOverdue = MilestoneService.isMilestoneOverdue(milestone);
  const delayDays = MilestoneService.calculateDelayDays(milestone);

  // Cascade calculations
  const totalTasks = childTasks.length;
  const completedTasks = childTasks.filter((t) => t.status === 'DONE').length;
  const allTasksDone = totalTasks > 0 && completedTasks === totalTasks;

  return (
    <div className="space-y-6">
      {/* HEADER ROW */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/milestones')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-400">{milestone.id}</span>
              <MilestoneStatusBadge type="category" value={milestone.category} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-950">{milestone.name}</h1>
          </div>
        </div>

        <Link
          to={`/milestones/${milestone.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-650 shadow-sm transition-colors hover:bg-zinc-50 self-start sm:self-auto"
        >
          <Edit2 className="h-4 w-4" />
          Edit Milestone
        </Link>
      </div>

      {/* OVERDUE DANGER BANNER */}
      {isOverdue && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 animate-bounce" />
          <div>
            <h4 className="font-bold">Project Milestone Deadline Past-Due</h4>
            <p className="text-xs font-medium text-rose-750 mt-0.5">
              This critical scheduling milestone is currently delayed by <strong>{delayDays} days</strong> against simulated bounds. Complete associated child tasks below.
            </p>
          </div>
        </div>
      )}

      {/* DUAL WORKSPACE DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Summary & Task linkages) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* MILESTONE SUMMARY & STAGES */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-3.5">1. Specifications & Criteria</h3>
              <p className="text-zinc-650 text-xs leading-relaxed leading-6 bg-zinc-50 border border-zinc-150 p-3 rounded-lg">
                {milestone.description}
              </p>
            </div>

            <hr className="border-zinc-150" />

            {/* PROJECT HEALTH & LIFE-STAGE ALIGNMENTS (Requirement 3 & 5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Project Health Indicators (Requirement 5) */}
              <div className="rounded-lg border border-zinc-200 p-4 bg-zinc-50/20 space-y-2">
                <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[9px]">Project Health Vector Status</span>
                <div className="flex items-center gap-2">
                  <MilestoneStatusBadge type="health" value={projectHealth} />
                  <span className="text-[10px] text-zinc-500 font-semibold italic">
                    {projectHealth === 'ON_TRACK'
                      ? 'Timelines respected.'
                      : projectHealth === 'AT_RISK'
                        ? 'Timelines narrow; close out child tasks.'
                        : 'Action required: milestone deadlines missed.'}
                  </span>
                </div>
              </div>

              {/* Lifecycle Stage Mapping (Requirement 3) */}
              <div className="rounded-lg border border-zinc-200 p-4 bg-zinc-50/20 space-y-2">
                <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[9px]">Mapped Lifecycle Stage</span>
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-brand-600" />
                  <span className="inline-flex items-center rounded bg-brand-50 border border-brand-200 px-2 py-0.5 font-mono text-[10px] font-bold text-brand-700 uppercase mt-0.5">
                    {milestone.stage.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

            </div>

            <hr className="border-zinc-150" />

            {/* Related project anchor link */}
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-brand-650" />
                <span className="text-zinc-500">Related Solar Array:</span>
                <Link
                  to={`/projects/${milestone.projectId}`}
                  className="font-bold text-zinc-800 hover:text-brand-750 hover:underline"
                >
                  {milestone.projectName}
                </Link>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">Logged: {milestone.createdAt}</span>
            </div>

          </div>

          {/* TASK-TO-MILESTONE AUTOMATIC CASCADE SECTION (Requirement 4) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <div className="border-b border-zinc-150 pb-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                  <CheckSquare className="h-4.5 w-4.5 text-brand-650" />
                  Associated Execution Tasks
                </h3>
                <p className="text-xs text-zinc-500">Milestone status cascades to COMPLETED when all linked tasks are DONE</p>
              </div>

              {/* Status summary */}
              {totalTasks > 0 ? (
                <div className={`rounded-full px-3 py-1 text-xs font-bold border ${
                  allTasksDone
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                }`}>
                  {completedTasks} of {totalTasks} Tasks Done
                </div>
              ) : (
                <span className="text-xs text-zinc-400 italic">No tasks mapped to stage</span>
              )}
            </div>

            {/* Alert describing the cascade logic */}
            {totalTasks > 0 && (
              <div className={`rounded-lg border p-3 flex items-start gap-2.5 text-xs ${
                allTasksDone
                  ? 'border-emerald-200 bg-emerald-50/10 text-emerald-800'
                  : 'border-indigo-150 bg-indigo-50/10 text-indigo-800'
              }`}>
                {allTasksDone ? (
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-indigo-600 mt-0.5 animate-pulse" />
                )}
                <div>
                  <h4 className="font-bold">{allTasksDone ? 'Cascade Successful' : 'Completion Cascade Pending'}</h4>
                  <p className="text-[11px] font-medium text-zinc-650 mt-0.5">
                    {allTasksDone
                      ? 'All child tasks linked to this milestone stage are COMPLETED. Parent milestone status successfully resolved to COMPLETED dynamically!'
                      : 'Milestone is awaiting completion of active child tasks. Click on a task to access its details and mark it DONE to verify the dynamic completion cascade!'}
                  </p>
                </div>
              </div>
            )}

            {/* List of child tasks */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-450">
                  <tr>
                    <th className="px-3 py-2.5">Task ID</th>
                    <th className="px-3 py-2.5">Task Name</th>
                    <th className="px-3 py-2.5">Assignee</th>
                    <th className="px-3 py-2.5">Due Date</th>
                    <th className="px-3 py-2.5">Progress</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 bg-white">
                  {childTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-zinc-400 italic">
                        No child tasks mapped under this project lifecycle stage. Add a task mapped to this stage to link them.
                      </td>
                    </tr>
                  ) : (
                    childTasks.map((t) => (
                      <tr key={t.id} className="hover:bg-zinc-50/50">
                        <td className="whitespace-nowrap px-3 py-3 font-mono font-bold text-zinc-500">{t.id}</td>
                        <td className="px-3 py-3 font-bold text-zinc-800 max-w-[150px] truncate">{t.title}</td>
                        <td className="px-3 py-3 text-zinc-600">{t.assigneeName || 'Unassigned'}</td>
                        <td className="whitespace-nowrap px-3 py-3 font-semibold text-zinc-600">
                          {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-3 py-3 font-semibold text-zinc-700">{t.progress}%</td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <span className={`inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                            t.status === 'DONE'
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                              : t.status === 'BLOCKED'
                                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                                : 'bg-zinc-50 border border-zinc-200 text-zinc-500'
                          }`}>
                            {t.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-right">
                          <Link
                            to={`/tasks/${t.id}`}
                            className="inline-flex h-6 w-6 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-500 shadow-xs hover:border-zinc-300 hover:text-zinc-955"
                            title="Edit Task Specs"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 1 Column (Timeline Stepper & Sequential visual chains) */}
        <div className="space-y-6">
          {/* TIMELINE METRICS (Requirement 1) */}
          <MilestoneTimeline milestone={milestone} />

          {/* SEQUENTIAL GRAPH PATHWAYS (Requirement 4) */}
          <MilestoneDependencies milestone={milestone} />
        </div>

      </div>
    </div>
  );
}
