import { LIFECYCLE_STAGES } from '@nature-tek/shared';
import { mockProjects, ProjectDetail, Milestone, Task, Approval } from '../mocks/projectMockData';

// Simulated current date for date calculations: May 29, 2026
const CURRENT_DATE = new Date('2026-05-29T13:00:00Z');

// Mutable local array to simulate database state changes in local browser session
let localProjects: ProjectDetail[] = [...mockProjects];

export interface GetProjectsFilters {
  search?: string;
  status?: string;
  type?: string;
  sortBy?: 'date' | 'progress' | 'capacity' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedProjects {
  data: ProjectDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProjectService {
  private static SIMULATED_LATENCY = 200;

  // Derives project progress based on 13-stage lifecycle (80% weight) and milestones (20% weight)
  static calculateProgress(project: ProjectDetail): number {
    if (project.status === 'COMPLETED') return 100;
    
    const stageIndex = LIFECYCLE_STAGES.indexOf(project.currentStage);
    if (stageIndex < 0) return 0;
    
    // Stage progress maps 0 to 80%
    const stageWeight = 80;
    const stageProgress = (stageIndex / (LIFECYCLE_STAGES.length - 1)) * stageWeight;

    // Milestone progress maps 0 to 20%
    const milestoneWeight = 20;
    const completedMilestones = project.milestones.filter((m) => m.status === 'COMPLETED').length;
    const totalMilestones = project.milestones.length;
    const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * milestoneWeight : 0;

    return Math.min(100, Math.round(stageProgress + milestoneProgress));
  }

  // Calculates delay days dynamically for active projects based on targetEnd vs. CURRENT_DATE
  static calculateDelayDays(project: ProjectDetail): number {
    if (project.status === 'COMPLETED' || project.status === 'ARCHIVED') return 0;
    const targetEnd = new Date(project.targetEnd);
    if (targetEnd < CURRENT_DATE) {
      const diffTime = Math.abs(CURRENT_DATE.getTime() - targetEnd.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  private static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getProjects(filters: GetProjectsFilters = {}): Promise<PaginatedProjects> {
    await this.delay(this.SIMULATED_LATENCY);

    const {
      search = '',
      status = 'ALL',
      type = 'ALL',
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filters;

    let filtered = localProjects.map((p) => ({
      ...p,
      delayDays: this.calculateDelayDays(p),
    }));

    // Apply Search (Search code, name, clientName, city)
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.code.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query) ||
          p.clientName.toLowerCase().includes(query) ||
          p.siteCity.toLowerCase().includes(query)
      );
    }

    // Apply Status Filter
    if (status && status !== 'ALL') {
      filtered = filtered.filter((p) => p.status === status);
    }

    // Apply Type Filter
    if (type && type !== 'ALL') {
      filtered = filtered.filter((p) => p.projectType === type);
    }

    // Apply Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.targetStart).getTime() - new Date(b.targetStart).getTime();
      } else if (sortBy === 'progress') {
        comparison = this.calculateProgress(a) - this.calculateProgress(b);
      } else if (sortBy === 'capacity') {
        comparison = a.capacityKw - b.capacityKw;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filtered.slice(startIndex, endIndex);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  }

  static async getProjectById(id: string): Promise<ProjectDetail | null> {
    await this.delay(this.SIMULATED_LATENCY);
    const found = localProjects.find((p) => p.id === id);
    if (!found) return null;

    return {
      ...found,
      delayDays: this.calculateDelayDays(found),
    };
  }

  static async createProject(
    data: Omit<ProjectDetail, 'id' | 'code' | 'currentStage' | 'status' | 'delayDays' | 'milestones' | 'tasks' | 'approvals' | 'documents' | 'resources'>
  ): Promise<ProjectDetail> {
    await this.delay(this.SIMULATED_LATENCY);

    // Auto-generate project code and ID
    const count = localProjects.length + 1;
    const code = `PRJ-2026-${String(count).padStart(3, '0')}`;
    const id = `p-${count}`;

    // Standard pre-defined milestones for clean, API-ready lifecycle tracking
    const defaultMilestones: Milestone[] = [
      { name: 'Charter signed & team assigned', targetDate: data.targetStart, completionDate: data.targetStart, status: 'COMPLETED' },
      { name: 'Roof structure survey & assessment', targetDate: new Date(new Date(data.targetStart).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'PENDING' },
      { name: 'Single-line diagram & design approval', targetDate: new Date(new Date(data.targetStart).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'PENDING' },
      { name: 'Material delivery to site', targetDate: new Date(new Date(data.targetStart).getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'PENDING' },
      { name: 'Racking and mounting structures complete', targetDate: new Date(new Date(data.targetStart).getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'PENDING' },
      { name: 'Modules installation & mounting', targetDate: new Date(new Date(data.targetStart).getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'PENDING' },
      { name: 'Electrical wiring & Inverter commissioned', targetDate: new Date(new Date(data.targetStart).getTime() + 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'PENDING' },
      { name: 'PTO from utility board', targetDate: data.targetEnd, status: 'PENDING' },
    ];

    const defaultTasks: Task[] = [
      { id: `t-${count}01`, title: 'Conduct initial customer kickoff meeting', status: 'DONE', priority: 'HIGH', dueDate: data.targetStart },
      { id: `t-${count}02`, title: 'Schedule structural engineer visit', status: 'NOT_STARTED', priority: 'MEDIUM', dueDate: defaultMilestones[1].targetDate },
    ];

    const defaultApprovals: Approval[] = [
      { id: `app-${count}01`, title: 'Project Kickoff Sign-off', type: 'STAGE_GATE', status: 'APPROVED', requestedBy: data.pmName, actedAt: new Date().toISOString().split('T')[0] },
    ];

    const newProject: ProjectDetail = {
      ...data,
      id,
      code,
      currentStage: 'PROJECT_CREATED',
      status: 'ACTIVE',
      delayDays: 0,
      milestones: defaultMilestones,
      tasks: defaultTasks,
      approvals: defaultApprovals,
      documents: [],
      resources: [
        { id: `res-${count}01`, name: data.pmName, role: 'PROJECT_MANAGER', type: 'HUMAN', details: `PM - Primary Assignee` },
      ],
    };

    localProjects.push(newProject);
    return newProject;
  }

  static async updateProject(id: string, updates: Partial<ProjectDetail>): Promise<ProjectDetail | null> {
    await this.delay(this.SIMULATED_LATENCY);

    const index = localProjects.findIndex((p) => p.id === id);
    if (index < 0) return null;

    // Maintain core properties while merging updates
    const current = localProjects[index];
    const updatedProject: ProjectDetail = {
      ...current,
      ...updates,
      id: current.id,
      code: current.code,
    };

    localProjects[index] = updatedProject;
    return updatedProject;
  }

  static async deleteProject(id: string): Promise<boolean> {
    await this.delay(this.SIMULATED_LATENCY);
    const before = localProjects.length;
    localProjects = localProjects.filter((p) => p.id !== id);
    return localProjects.length < before;
  }
}
