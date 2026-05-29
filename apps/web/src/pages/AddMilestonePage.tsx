import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MilestoneForm } from '../components/milestones/MilestoneForm';
import { MilestoneService } from '../services/milestoneService';

export default function AddMilestonePage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      await MilestoneService.createMilestone(data);
      navigate('/milestones');
    } catch (err) {
      console.error('Failed to create milestone gate:', err);
      alert('An error occurred while creating the milestone. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/milestones')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">Create Milestone Gate</h1>
          <p className="text-xs text-zinc-500 font-semibold font-mono">Establish new regulatory approvals, installation sign-offs, or handover checkpoints</p>
        </div>
      </div>

      {/* FORM CARD */}
      <MilestoneForm onSubmit={handleSubmit} onCancel={() => navigate('/milestones')} />
    </div>
  );
}
