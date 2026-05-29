import { mockMilestones, MilestoneDetail, MilestoneCategory, MilestoneStatus } from '../mocks/milestoneMockData';
import { TaskService } from './taskService';
import { ProjectService } from './projectService';

const CURRENT_DATE = new Date('2026-05-29T14:08:00Z');

let localMilestones: MilestoneDetail[] = [...mockMilestones];

export interface GetMilestonesFilters {
  search?: string;
  projectId?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedMilestones {
  data: MilestoneDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class MilestoneService {
  private static LATENCY = 100;

  // DYNAMIC OVERDUE AND DELAY HELPERS (Requirement 1)
  static isMilestoneOverdue(m: MilestoneDetail): boolean {
    if (m.status === 'COMPLETED') return false;
    const targetDate = new Date(m.targetDate);
    return targetDate < CURRENT_DATE;
  }

  static calculateDelayDays(m: MilestoneDetail): number {
    if (m.status === 'COMPLETED') return 0;
    const targetDate = new Date(m.targetDate);
    if (targetDate < CURRENT_DATE) {
      const diffTime = Math.abs(CURRENT_DATE.getTime() - targetDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  // TASK-TO-MILESTONE AUTOMATIC STATUS CASCADE (Requirement 1 & 4)
  private static async cascadeTaskToMilestone(m: MilestoneDetail): Promise<MilestoneDetail> {
    try {
      // Fetch all child tasks linked under the same project and stage
      const tasksResult = await TaskService.getTasks({
        projectId: m.projectId,
        limit: 100,
      });

      const childTasks = tasksResult.data.filter((t) => t.stage === m.stage);

      if (childTasks.length > 0) {
        const allDone = childTasks.every((t) => t.status === 'DONE');
        const anyBlocked = childTasks.some((t) => t.status === 'BLOCKED');
        const anyInProgress = childTasks.some((t) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW');

        if (allDone) {
          return {
            ...m,
            status: 'COMPLETED',
            completedAt: m.completedAt ?? '2026-05-29',
          };
        } else if (anyBlocked) {
          return {
            ...m,
            status: this.isMilestoneOverdue(m) ? 'OVERDUE' : m.status,
          };
        } else if (anyInProgress) {
          return {
            ...m,
            status: this.isMilestoneOverdue(m) ? 'OVERDUE' : 'IN_PROGRESS',
          };
        }
      }
    } catch (err) {
      console.error('Failed to execute task-to-milestone status cascade check:', err);
    }

    // Default status fallback check for overdue deadlines
    if (this.isMilestoneOverdue(m) && m.status !== 'COMPLETED') {
      return {
        ...m,
        status: 'OVERDUE',
      };
    }

    return m;
  }

  private static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // PROJECT HEALTH INDICATION INTEGRATION (Requirement 2 & 5)
  static async deriveProjectHealth(projectId: string): Promise<'ON_TRACK' | 'AT_RISK' | 'DELAYED'> {
    const milestones = localMilestones.filter((m) => m.projectId === projectId);
    if (milestones.length === 0) return 'ON_TRACK';

    let hasOverdue = false;
    let hasDueSoonNotCompleted = false;

    for (const m of milestones) {
      const enriched = await this.cascadeTaskToMilestone(m);
      if (enriched.status === 'OVERDUE' || this.isMilestoneOverdue(enriched)) {
        hasOverdue = true;
      }

      // Check if due within 5 days of simulated today (May 29, 2026) and not completed
      const target = new Date(enriched.targetDate);
      const timeDiff = target.getTime() - CURRENT_DATE.getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      if (enriched.status !== 'COMPLETED' && daysDiff >= 0 && daysDiff <= 5) {
        hasDueSoonNotCompleted = true;
      }
    }

    if (hasOverdue) return 'DELAYED';
    if (hasDueSoonNotCompleted) return 'AT_RISK';
    return 'ON_TRACK';
  }

  // SERVICE INTERFACES
  static async getMilestones(filters: GetMilestonesFilters = {}): Promise<PaginatedMilestones> {
    await this.delay(this.LATENCY);

    const {
      search = '',
      projectId = 'ALL',
      status = 'ALL',
      category = 'ALL',
      page = 1,
      limit = 10,
    } = filters;

    let filtered: MilestoneDetail[] = [];
    for (const m of localMilestones) {
      const enriched = await this.cascadeTaskToMilestone(m);
      filtered.push(enriched);
    }

    // Apply Search
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.projectName.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query)
      );
    }

    // Apply Project Filter
    if (projectId && projectId !== 'ALL') {
      filtered = filtered.filter((m) => m.projectId === projectId);
    }

    // Apply Status Filter
    if (status && status !== 'ALL') {
      filtered = filtered.filter((m) => m.status === status);
    }

    // Apply Category Filter
    if (category && category !== 'ALL') {
      filtered = filtered.filter((m) => m.category === category);
    }

    // Sort by Target Date
    filtered.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

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

  static async getMilestoneById(id: string): Promise<MilestoneDetail | null> {
    await this.delay(this.LATENCY);
    const found = localMilestones.find((m) => m.id === id);
    if (!found) return null;

    // Fetch related project current stage details dynamically
    const proj = await ProjectService.getProjectById(found.projectId);
    const projectName = proj ? proj.name : found.projectName;

    const baseMilestone = {
      ...found,
      projectName,
    };

    return this.cascadeTaskToMilestone(baseMilestone);
  }

  static async createMilestone(
    data: Omit<
      MilestoneDetail,
      'id' | 'projectName' | 'createdAt'
    >
  ): Promise<MilestoneDetail> {
    await this.delay(this.LATENCY);

    const proj = await ProjectService.getProjectById(data.projectId);
    const projectName = proj ? proj.name : 'Unknown Solar Installation';

    const count = localMilestones.length + 101;
    const id = `m-${count}`;

    const newMilestone: MilestoneDetail = {
      ...data,
      id,
      projectName,
      createdAt: new Date().toISOString().split('T')[0],
    };

    localMilestones.push(newMilestone);
    return newMilestone;
  }

  static async updateMilestone(id: string, updates: Partial<MilestoneDetail>): Promise<MilestoneDetail | null> {
    await this.delay(this.LATENCY);
    const index = localMilestones.findIndex((m) => m.id === id);
    if (index < 0) return null;

    const current = localMilestones[index];
    const updated: MilestoneDetail = {
      ...current,
      ...updates,
      id: current.id,
      projectId: current.projectId,
    };

    localMilestones[index] = updated;
    return this.cascadeTaskToMilestone(updated);
  }

  static async deleteMilestone(id: string): Promise<boolean> {
    await this.delay(this.LATENCY);
    const before = localMilestones.length;
    localMilestones = localMilestones.filter((m) => m.id !== id);
    return localMilestones.length < before;
  }
}
