import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  RefreshCw,
  AlertTriangle,
  Edit,
  ArrowLeft,
  Calendar,
  Settings,
  MapPin,
  User,
  Activity,
  Layers,
  FileText,
  Users,
  CheckSquare
} from 'lucide-react';
import { ProjectService, ProjectDetail } from '../services/projectService';
import { ProjectLifecycleTimeline } from '../components/projects/ProjectLifecycleTimeline';
import { ProjectMilestones } from '../components/projects/ProjectMilestones';
import { ProjectApprovals } from '../components/projects/ProjectApprovals';
import { ProjectDocuments } from '../components/projects/ProjectDocuments';
import { ResourceAllocationWidget } from '../components/projects/ResourceAllocationWidget';
import { LIFECYCLE_STAGE_LABELS } from '@nature-tek/shared';

// Simulated current date for date validations: May 29, 2026
const CURRENT_DATE = new Date('2026-05-29T13:00:00Z');

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tab states: 'milestones' | 'approvals' | 'documents' | 'resources'
  const [activeTab, setActiveTab] = useState<'milestones' | 'approvals' | 'documents' | 'resources'>('milestones');

  const loadProject = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await ProjectService.getProjectById(id);
      if (!data) {
        setError('Solar project not found in workspace databases');
      } else {
        setProject(data);
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('System synchronizer failed to pull project details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleAdvanceStage = async (newStage: ProjectDetail['currentStage']) => {
    if (!project) return;
    try {
      // Find milestone corresponding to new stage, set to COMPLETED
      let updatedMilestones = [...project.milestones];
      const matchIndex = updatedMilestones.findIndex((m) =>
        m.name.toLowerCase().includes(newStage.replace(/_/g, ' ').toLowerCase().slice(0, 10))
      );
      if (matchIndex >= 0) {
        updatedMilestones[matchIndex] = {
          ...updatedMilestones[matchIndex],
          status: 'COMPLETED',
          completionDate: new Date().toISOString().split('T')[0],
        };
      }

      const updated = await ProjectService.updateProject(project.id, {
        currentStage: newStage,
        milestones: updatedMilestones,
        status: newStage === 'COMPLETED' ? 'COMPLETED' : project.status,
      });

      if (updated) {
        setProject(updated);
      }
    } catch (err) {
      console.error('Failed to advance project stage:', err);
      alert('Error advancing lifecycle stage');
    }
  };

  const handleApproveReject = async (approvalId: string, action: 'APPROVED' | 'REJECTED') => {
    if (!project) return;
    try {
      const updatedApprovals = project.approvals.map((app) => {
        if (app.id === approvalId) {
          return {
            ...app,
            status: action,
            actedAt: new Date().toISOString().split('T')[0],
          };
        }
        return app;
      });

      const updated = await ProjectService.updateProject(project.id, {
        approvals: updatedApprovals,
      });

      if (updated) {
        setProject(updated);
      }
    } catch (err) {
      console.error('Failed to act on approval:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-7 w-7 animate-spin text-brand-600" />
          <span className="text-sm font-semibold text-zinc-500">Querying details registry...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Sync Failed</p>
            <p className="mt-0.5 text-xs text-red-650">{error ?? 'Project not found.'}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 flex items-center gap-1.5 rounded-lg border border-red-250 bg-white px-3.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Registry
        </button>
      </div>
    );
  }

  // Derive task aggregates for Requirement 1
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.status === 'DONE').length;
  const openTasks = totalTasks - completedTasks;
  const delayedTasks = project.tasks.filter(
    (t) => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < CURRENT_DATE
  ).length;

  // Derived progress and delay days for Requirement 2
  const progress = ProjectService.calculateProgress(project);
  const delay = ProjectService.calculateDelayDays(project);

  return (
    <div className="space-y-6">
      {/* Top Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase mb-1">
            <Link to="/projects" className="hover:text-zinc-650 transition-colors flex items-center gap-0.5">
              <ArrowLeft className="h-3 w-3" />
              Registry
            </Link>
            <span>/</span>
            <span className="text-zinc-500 font-mono">{project.code}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 flex flex-wrap items-center gap-2.5">
            {project.name}
            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
              project.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : project.status === 'COMPLETED'
                  ? 'bg-brand-50 text-brand-700 border-brand-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {project.status}
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-semibold">Registered Client: {project.clientName} ({project.clientEmail})</p>
        </div>

        <Link
          to={`/projects/${project.id}/edit`}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 self-start sm:self-auto"
        >
          <Edit className="h-4 w-4" />
          Edit Specifications
        </Link>
      </div>

      {/* Grid: Left Summary Box, Right Progress slider */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Parameters Card */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Project parameters summary</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="flex items-center gap-1 text-zinc-400 font-bold uppercase tracking-wide">
                <Settings className="h-3.5 w-3.5" />
                Capacity
              </span>
              <p className="font-bold text-zinc-950 text-sm">
                {project.capacityKw >= 1000 ? `${(project.capacityKw / 1000).toFixed(1)} MW` : `${project.capacityKw} kW`}
              </p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1 text-zinc-400 font-bold uppercase tracking-wide">
                <MapPin className="h-3.5 w-3.5" />
                Location
              </span>
              <p className="font-bold text-zinc-950 text-sm truncate">
                {project.siteCity}, {project.siteState}
              </p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1 text-zinc-400 font-bold uppercase tracking-wide">
                <User className="h-3.5 w-3.5" />
                Manager
              </span>
              <p className="font-bold text-zinc-950 text-sm truncate">{project.pmName}</p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1 text-zinc-400 font-bold uppercase tracking-wide">
                <Calendar className="h-3.5 w-3.5" />
                Schedule Target
              </span>
              <p className="font-bold text-zinc-950 text-sm">{project.targetEnd}</p>
            </div>
          </div>

          <hr className="border-zinc-150" />

          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-zinc-400 block mb-1">Scope of work description</span>
            <p className="text-xs text-zinc-650 leading-relaxed">{project.description}</p>
          </div>
        </div>

        {/* Derived Completion Tracker Card */}
        <div className="lg:col-span-1 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dynamic system progress</h3>
            <span className="text-[10px] text-zinc-400 font-semibold block leading-none mt-0.5">Derived from active stage and milestones</span>
          </div>

          <div className="my-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight text-zinc-950">{progress}%</span>
              <span className="text-xs font-medium text-zinc-400">completeness ratio</span>
            </div>

            <div className="h-3 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  project.status === 'COMPLETED'
                    ? 'bg-brand-500'
                    : delay > 0
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-indigo-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-150">
            <span className="font-semibold text-zinc-500">Current Phase:</span>
            <span className="font-bold text-zinc-900">{LIFECYCLE_STAGE_LABELS[project.currentStage]}</span>
          </div>
        </div>
      </div>

      {/* Requirement 1: Task Summary KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Tasks</span>
            <CheckSquare className="h-4.5 w-4.5 text-zinc-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">{totalTasks}</p>
          <span className="text-[10px] text-zinc-400 font-semibold mt-1 block">Work scopes cataloged</span>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Open Tasks</span>
            <Activity className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">{openTasks}</p>
          <span className="text-[10px] text-zinc-400 font-semibold mt-1 block">In-progress or not started</span>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Completed Tasks</span>
            <CheckSquare className="h-4.5 w-4.5 text-brand-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">{completedTasks}</p>
          <span className="text-[10px] text-zinc-400 font-semibold mt-1 block">Closed by team supervisor</span>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Delayed Tasks</span>
            <AlertTriangle className={`h-4.5 w-4.5 ${delayedTasks > 0 ? 'text-red-500 animate-bounce' : 'text-zinc-300'}`} />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">{delayedTasks}</p>
          <span className="text-[10px] text-zinc-400 font-semibold mt-1 block">Passed target due date</span>
        </div>
      </div>

      {/* Main Grid: Details tabs on left, Stepper Timeline on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns (Span 2): Tab Container */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Navigation header */}
          <div className="flex border-b border-zinc-200 bg-white rounded-t-xl px-2 pt-2">
            {[
              { id: 'milestones', label: 'Milestones checklist', icon: <Layers className="h-4 w-4" /> },
              { id: 'approvals', label: 'Stage approvals', icon: <CheckSquare className="h-4 w-4" /> },
              { id: 'resources', label: 'Resource allocations', icon: <Users className="h-4 w-4" /> },
              { id: 'documents', label: 'Drawings & reports', icon: <FileText className="h-4 w-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold uppercase tracking-wide border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-700 font-bold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Render Active Tab widget */}
          <div>
            {activeTab === 'milestones' && <ProjectMilestones milestones={project.milestones} />}
            {activeTab === 'approvals' && (
              <ProjectApprovals approvals={project.approvals} onApproveReject={handleApproveReject} />
            )}
            {activeTab === 'resources' && <ResourceAllocationWidget resources={project.resources} />}
            {activeTab === 'documents' && <ProjectDocuments documents={project.documents} />}
          </div>
        </div>

        {/* Right Column (Span 1): Stepper Timeline */}
        <div className="lg:col-span-1">
          <ProjectLifecycleTimeline project={project} onAdvanceStage={handleAdvanceStage} />
        </div>
      </div>
    </div>
  );
}
