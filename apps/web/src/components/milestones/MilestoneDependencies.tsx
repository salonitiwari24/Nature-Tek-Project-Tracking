import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, CheckCircle2, ChevronRightCircle } from 'lucide-react';
import { MilestoneDetail, MilestoneService } from '../../services/milestoneService';
import { MilestoneStatusBadge } from './MilestoneStatusBadge';

interface MilestoneDependenciesProps {
  milestone: MilestoneDetail;
}

export function MilestoneDependencies({ milestone }: MilestoneDependenciesProps) {
  const [prevMilestone, setPrevMilestone] = useState<MilestoneDetail | null>(null);
  const [nextMilestone, setNextMilestone] = useState<MilestoneDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLinkedMilestones = async () => {
      setLoading(true);
      try {
        if (milestone.previousMilestoneId) {
          const prev = await MilestoneService.getMilestoneById(milestone.previousMilestoneId);
          setPrevMilestone(prev);
        } else {
          setPrevMilestone(null);
        }

        if (milestone.nextMilestoneId) {
          const next = await MilestoneService.getMilestoneById(milestone.nextMilestoneId);
          setNextMilestone(next);
        } else {
          setNextMilestone(null);
        }
      } catch (err) {
        console.error('Failed to load dependency chain details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinkedMilestones();
  }, [milestone]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      <div className="border-b border-zinc-150 pb-3">
        <h3 className="text-base font-bold text-zinc-950">Milestone Sequential Track</h3>
        <p className="text-xs text-zinc-500">Track structural predecessors and succeeding gates</p>
      </div>

      {loading ? (
        <div className="flex h-24 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-650" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 relative">
          
          {/* 1. PREVIOUS MILESTONE */}
          <div className="flex-1 min-w-0">
            {prevMilestone ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 hover:bg-zinc-50 transition-colors flex flex-col justify-between h-full">
                <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[8px] mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Preceding Gate (Predecessor)
                </span>
                <Link
                  to={`/milestones/${prevMilestone.id}`}
                  className="font-bold text-xs text-zinc-800 hover:text-brand-700 hover:underline truncate block"
                  title={prevMilestone.name}
                >
                  {prevMilestone.name}
                </Link>
                <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                  <span className="text-[10px] text-zinc-450 font-medium">Target: {formatDate(prevMilestone.targetDate)}</span>
                  <MilestoneStatusBadge type="status" value={prevMilestone.status} />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/10 p-3 text-center flex flex-col items-center justify-center text-zinc-400 text-xs italic h-[92px]">
                No preceding milestone
              </div>
            )}
          </div>

          {/* CONNECTOR ARROW 1 */}
          <div className="hidden md:flex h-8 items-center justify-center text-zinc-300">
            <ArrowRight className="h-5 w-5 animate-pulse text-brand-600" />
          </div>

          {/* 2. ACTIVE MILESTONE (CURRENTLY VIEWED) */}
          <div className="flex-1 min-w-0">
            <div className="rounded-lg border-2 border-brand-600 bg-brand-50/10 p-3 flex flex-col justify-between h-full relative">
              <span className="block font-extrabold text-brand-700 uppercase tracking-wider text-[8px] mb-1.5 flex items-center gap-1">
                <ChevronRightCircle className="h-3 w-3 text-brand-650 animate-spin" />
                Active Focus Gate
              </span>
              <span className="font-extrabold text-xs text-brand-850 truncate block" title={milestone.name}>
                {milestone.name}
              </span>
              <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                <span className="text-[10px] text-brand-650 font-bold">Target: {formatDate(milestone.targetDate)}</span>
                <MilestoneStatusBadge type="status" value={milestone.status} />
              </div>
            </div>
          </div>

          {/* CONNECTOR ARROW 2 */}
          <div className="hidden md:flex h-8 items-center justify-center text-zinc-300">
            <ArrowRight className="h-5 w-5 text-zinc-300" />
          </div>

          {/* 3. NEXT MILESTONE */}
          <div className="flex-1 min-w-0">
            {nextMilestone ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 hover:bg-zinc-50 transition-colors flex flex-col justify-between h-full">
                <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[8px] mb-1.5 flex items-center gap-1">
                  <Lock className="h-3 w-3 text-zinc-450" />
                  Succeeding Gate (Successor)
                </span>
                <Link
                  to={`/milestones/${nextMilestone.id}`}
                  className="font-bold text-xs text-zinc-800 hover:text-brand-700 hover:underline truncate block"
                  title={nextMilestone.name}
                >
                  {nextMilestone.name}
                </Link>
                <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                  <span className="text-[10px] text-zinc-450 font-medium">Target: {formatDate(nextMilestone.targetDate)}</span>
                  <MilestoneStatusBadge type="status" value={nextMilestone.status} />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/10 p-3 text-center flex flex-col items-center justify-center text-zinc-400 text-xs italic h-[92px]">
                No downstream milestones
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
