import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectForm } from '../components/projects/ProjectForm';
import { ProjectService, ProjectDetail } from '../services/projectService';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await ProjectService.getProjectById(id);
        if (!data) {
          setError('Project not found');
        } else {
          setProject(data);
        }
      } catch (err) {
        console.error('Failed to load project details:', err);
        setError('Failed to fetch project details');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    if (!id) return;
    try {
      await ProjectService.updateProject(id, formData);
      navigate(`/projects/${id}`);
    } catch (err) {
      console.error('Failed to update project:', err);
      alert('An error occurred while updating the project.');
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/projects/${id}`);
    } else {
      navigate('/projects');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-brand-600" />
          <span className="text-sm font-medium text-zinc-500 font-semibold">Retrieving project data...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Retrieval Error</p>
            <p className="mt-0.5 text-xs text-red-650">{error ?? 'An unexpected error occurred.'}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 rounded bg-white border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
        >
          Back to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb Header */}
      <div className="border-b border-zinc-200 pb-4">
        <nav className="flex text-xs font-semibold text-zinc-400 gap-1.5 uppercase mb-1">
          <button onClick={() => navigate('/projects')} className="hover:text-zinc-600 transition-colors">Projects</button>
          <span>/</span>
          <button onClick={handleCancel} className="hover:text-zinc-600 transition-colors truncate max-w-[150px]">{project.name}</button>
          <span>/</span>
          <span className="text-zinc-500">Edit Settings</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Modify Solar System Parameters</h1>
        <p className="text-sm text-zinc-500">Edit operational schedules, project budget limits, and client communication interfaces</p>
      </div>

      {/* Shared form */}
      <div className="p-1">
        <ProjectForm initialData={project} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
