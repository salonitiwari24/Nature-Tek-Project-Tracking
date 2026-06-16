import { useNavigate } from 'react-router-dom';
import { ProjectForm } from '../components/projects/ProjectForm';
import { ProjectService } from '../services/projectService';

export function AddProjectPage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      const payload = {
        ...formData,

        code: `PRJ-${Date.now()}`,

        targetStart: formData.targetStart
          ? new Date(
              formData.targetStart
            ).toISOString()
          : undefined,

        targetEnd: formData.targetEnd
          ? new Date(
              formData.targetEnd
            ).toISOString()
          : undefined,
      };

      console.log(
        'Submitting project:',
        payload
      );

      await ProjectService.createProject(
        payload
      );

      navigate('/projects');
    } catch (err) {
      console.error(
        'Failed to create project:',
        err
      );

      alert(
        'An error occurred while creating the project.'
      );
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-zinc-200 pb-4">
        <nav className="flex text-xs font-semibold text-zinc-400 gap-1.5 uppercase mb-1">
          <button
            onClick={handleCancel}
            className="hover:text-zinc-600 transition-colors"
          >
            Projects
          </button>

          <span>/</span>

          <span className="text-zinc-500">
            New Solar System
          </span>
        </nav>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Register New Installation
        </h1>

        <p className="text-sm text-zinc-500">
          Initialize a project charter
          and setup default stage
          milestones
        </p>
      </div>

      <div className="p-1">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}