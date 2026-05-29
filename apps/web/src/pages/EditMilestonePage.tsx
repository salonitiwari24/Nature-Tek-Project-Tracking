import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MilestoneForm } from '../components/milestones/MilestoneForm';
import { MilestoneService, MilestoneDetail } from '../services/milestoneService';

export default function EditMilestonePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [milestone, setMilestone] = useState<MilestoneDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMilestoneSpec = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await MilestoneService.getMilestoneById(id);
        setMilestone(data);
      } catch (err) {
        console.error('Error pre-loading milestone specs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMilestoneSpec();
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    try {
      await MilestoneService.updateMilestone(id, data);
      navigate(`/milestones/${id}`);
    } catch (err) {
      console.error('Failed to update milestone gate:', err);
      alert('An error occurred while updating the milestone.');
    }
  };

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
        <p className="text-sm font-semibold text-zinc-500">Milestone parameters not found.</p>
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/milestones/${id}`)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">Modify Milestone: {milestone.id}</h1>
          <p className="text-xs text-zinc-500 font-semibold font-mono">Modify stage mapping, status parameters, or dates</p>
        </div>
      </div>

      {/* FORM CARD */}
      <MilestoneForm initialData={milestone} onSubmit={handleSubmit} onCancel={() => navigate(`/milestones/${id}`)} />
    </div>
  );
}
