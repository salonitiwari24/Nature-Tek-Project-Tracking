import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, CheckCircle2, ShieldAlert, FolderOpen, Calendar, Clock, User, AlertTriangle, Layers } from 'lucide-react';
import { TaskDetail, TaskService } from '../services/taskService';
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge';
import { TaskTimeline } from '../components/tasks/TaskTimeline';
import { TaskComments } from '../components/tasks/TaskComments';
import { TaskAttachments } from '../components/tasks/TaskAttachments';

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadTask = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await TaskService.getTaskById(id);
      setTask(data);
    } catch (err) {
      console.error('Error fetching task details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleStatusUpdate = async (newStatus: 'DONE' | 'BLOCKED') => {
    if (!task) return;
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'DONE') {
        updates.progress = 100;
      }
      await TaskService.updateTask(task.id, updates);
      await loadTask();
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const handleAddComment = async (body: string) => {
    if (!task) return;
    try {
      const newComment = {
        id: `c-${task.id}-${task.comments.length + 1}`,
        authorName: 'Amit Sharma', // current PM simulated session
        authorRole: 'Project Manager',
        body,
        createdAt: new Date().toISOString(),
      };
      await TaskService.updateTask(task.id, {
        comments: [...task.comments, newComment],
      });
      await loadTask();
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12 rounded-xl border border-zinc-200 bg-white">
        <p className="text-sm font-semibold text-zinc-500">Task details could not be found.</p>
        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
        >
          Back to Registry
        </button>
      </div>
    );
  }

  const isOverdue = TaskService.isOverdue(task);
  const isDueSoon = TaskService.isDueSoon(task);
  const delayDays = TaskService.calculateDelayDays(task);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Helper to visualize dependency status badges (Requirement 2)
  const getDependencyBadge = (status: string) => {
    switch (status) {
      case 'DONE':
        return (
          <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-250 px-2 py-0.5 text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
            Completed
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex rounded-full bg-rose-50 border border-rose-250 px-2 py-0.5 text-[9px] font-bold text-rose-700 uppercase tracking-wider">
            Blocked
          </span>
        );
      case 'IN_PROGRESS':
      case 'IN_REVIEW':
        return (
          <span className="inline-flex rounded-full bg-indigo-50 border border-indigo-250 px-2 py-0.5 text-[9px] font-bold text-indigo-700 uppercase tracking-wider">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-zinc-50 border border-zinc-250 px-2 py-0.5 text-[9px] font-bold text-zinc-505 uppercase tracking-wider">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER NAVIGATION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-400">{task.id}</span>
              <TaskStatusBadge type="category" value={task.category} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-950">{task.title}</h1>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {task.status !== 'DONE' && (
            <button
              type="button"
              onClick={() => handleStatusUpdate('DONE')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
            </button>
          )}
          {task.status !== 'BLOCKED' && task.status !== 'DONE' && (
            <button
              type="button"
              onClick={() => handleStatusUpdate('BLOCKED')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-rose-700"
            >
              <ShieldAlert className="h-4 w-4" />
              Flag Blocked
            </button>
          )}
          <Link
            to={`/tasks/${task.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-650 shadow-sm transition-colors hover:bg-zinc-50"
          >
            <Edit2 className="h-4 w-4" />
            Edit Task
          </Link>
        </div>
      </div>

      {/* OVERDUE ALERTS BANNERS */}
      {isOverdue && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 animate-bounce" />
          <div>
            <h4 className="font-bold">Execution Milestone Overdue</h4>
            <p className="text-xs font-medium text-rose-750 mt-0.5">
              This task has exceeded its designated target completion date of {formatDate(task.dueDate)} by{' '}
              <strong>{delayDays} days</strong>. Please update supervisors or log blocking issues.
            </p>
          </div>
        </div>
      )}

      {isDueSoon && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 animate-pulse" />
          <div>
            <h4 className="font-bold">Approaching Deadline</h4>
            <p className="text-xs font-medium text-amber-750 mt-0.5">
              This critical task is scheduled to complete within the next 3 days ({formatDate(task.dueDate)}). Ensure key
              milestones are coordinated.
            </p>
          </div>
        </div>
      )}

      {/* DUAL WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Summary & Contexts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TASK SUMMARY & CORE CONTEXTS */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-3.5">1. Task Specifications & Schedule</h3>
              <p className="text-zinc-600 text-xs leading-relaxed leading-6 bg-zinc-50 border border-zinc-150 p-3 rounded-lg">
                {task.description || 'No detailed scope narrative documented. Modify specifications to add details.'}
              </p>
            </div>

            <hr className="border-zinc-150" />

            {/* PROJECT CONTEXT INTEGRATION (Requirement 1) */}
            <div className="rounded-lg border border-brand-100 bg-brand-50/10 p-4 space-y-3.5">
              <div className="flex items-center gap-2 text-brand-700">
                <Layers className="h-4.5 w-4.5 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Project Context Integration</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Related Project</span>
                  <Link
                    to={`/projects/${task.projectId}`}
                    className="font-extrabold text-sm text-brand-750 hover:underline"
                  >
                    {task.projectName}
                  </Link>
                </div>
                <div>
                  <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Current Project Stage</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-[10px] font-bold text-brand-700 mt-0.5">
                    {task.projectStage.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-zinc-150" />

            {/* Specific Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs">
              <div>
                <span className="block text-zinc-400 font-bold uppercase tracking-wide text-[10px] mb-1">Assignee</span>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 border border-zinc-250 text-zinc-500">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="block font-bold text-zinc-800 leading-tight">{task.assigneeName || 'Unassigned'}</span>
                    <span className="text-[10px] text-zinc-400 font-medium">{task.assigneeRole}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="block text-zinc-400 font-bold uppercase tracking-wide text-[10px] mb-1">Task Priority</span>
                <TaskStatusBadge type="priority" value={task.priority} />
              </div>

              <div>
                <span className="block text-zinc-400 font-bold uppercase tracking-wide text-[10px] mb-1">Task Status</span>
                <TaskStatusBadge type="status" value={task.status} />
              </div>

              <div>
                <span className="block text-zinc-400 font-bold uppercase tracking-wide text-[10px] mb-1">Target Start Date</span>
                <span className="font-semibold text-zinc-700 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  {formatDate(task.startDate)}
                </span>
              </div>

              <div>
                <span className="block text-zinc-400 font-bold uppercase tracking-wide text-[10px] mb-1">Target Due Date</span>
                <span className="font-semibold text-zinc-700 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  {formatDate(task.dueDate)}
                </span>
              </div>

              <div>
                <span className="block text-zinc-400 font-bold uppercase tracking-wide text-[10px] mb-1">Estimated Hours</span>
                <span className="font-semibold text-zinc-700 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  {task.estimatedHours} Hours
                </span>
              </div>
            </div>

            <hr className="border-zinc-150" />

            {/* Task Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-550">
                <span>Task Execution Progress</span>
                <span className="text-zinc-800">{task.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    task.status === 'DONE'
                      ? 'bg-brand-500'
                      : task.status === 'BLOCKED'
                        ? 'bg-red-500'
                        : 'bg-indigo-500'
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* DEPENDENCY TRACKING (Requirement 2) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <div className="border-b border-zinc-150 pb-3">
              <h3 className="text-base font-bold text-zinc-950">Dependency Status Map</h3>
              <p className="text-xs text-zinc-500">Track preceding tasks blocking execution or downstream dependent tasks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Blocking Tasks */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  Blocking Tasks (Predecessors)
                </h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {task.dependencies.filter((d) => d.relationType === 'BLOCKING').length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">No preceding task blocking this execution.</p>
                  ) : (
                    task.dependencies
                      .filter((d) => d.relationType === 'BLOCKING')
                      .map((dep) => (
                        <div
                          key={dep.id}
                          className="flex items-center justify-between rounded-lg border border-zinc-150 p-2.5 bg-zinc-50/50 hover:bg-zinc-50 transition-all"
                        >
                          <div className="min-w-0 pr-2">
                            <Link
                              to={`/tasks/${dep.id}`}
                              className="block text-xs font-bold text-zinc-800 hover:text-brand-700 truncate"
                            >
                              {dep.title}
                            </Link>
                            <span className="block font-mono text-[9px] text-zinc-400 mt-0.5">{dep.id}</span>
                          </div>
                          {getDependencyBadge(dep.status)}
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Dependent Tasks */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-650 flex items-center gap-1">
                  <FolderOpen className="h-4 w-4 shrink-0" />
                  Dependent Tasks (Successors)
                </h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {task.dependencies.filter((d) => d.relationType === 'DEPENDENT').length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">No downstream tasks dependent on this completion.</p>
                  ) : (
                    task.dependencies
                      .filter((d) => d.relationType === 'DEPENDENT')
                      .map((dep) => (
                        <div
                          key={dep.id}
                          className="flex items-center justify-between rounded-lg border border-zinc-150 p-2.5 bg-zinc-50/50 hover:bg-zinc-50 transition-all"
                        >
                          <div className="min-w-0 pr-2">
                            <Link
                              to={`/tasks/${dep.id}`}
                              className="block text-xs font-bold text-zinc-800 hover:text-brand-700 truncate"
                            >
                              {dep.title}
                            </Link>
                            <span className="block font-mono text-[9px] text-zinc-400 mt-0.5">{dep.id}</span>
                          </div>
                          {getDependencyBadge(dep.status)}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COMMENTS COMPONENT */}
          <TaskComments comments={task.comments} onAddComment={handleAddComment} />
        </div>

        {/* Right 1 Column: Timelines & Attachments */}
        <div className="space-y-6">
          {/* TIMELINE STEPPER */}
          <TaskTimeline task={task} />

          {/* ATTACHMENTS */}
          <TaskAttachments attachments={task.attachments} />
        </div>
      </div>
    </div>
  );
}
