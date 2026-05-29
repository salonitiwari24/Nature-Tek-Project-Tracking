import { mockTasks, TaskDetail, TaskCategory, TaskStatus, TaskPriority } from '../mocks/taskMockData';
import { ProjectService } from './projectService';

// Simulated current today date: May 29, 2026
const CURRENT_DATE = new Date('2026-05-29T13:48:55Z');

let localTasks: TaskDetail[] = [...mockTasks];

export interface GetTasksFilters {
  search?: string;
  projectId?: string;
  status?: string;
  priority?: string;
  category?: string;
  sortBy?: 'dueDate' | 'progress' | 'priority' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedTasks {
  data: TaskDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class TaskService {
  private static SIMULATED_LATENCY = 150;

  // DELAY DETECTION LOGIC HELPER FUNCTIONS (Requirement 7)
  
  static isOverdue(task: TaskDetail): boolean {
    if (task.status === 'DONE' || task.status === 'CANCELLED') return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < CURRENT_DATE;
  }

  static isDueSoon(task: TaskDetail): boolean {
    if (task.status === 'DONE' || task.status === 'CANCELLED') return false;
    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - CURRENT_DATE.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    return daysDiff >= 0 && daysDiff <= 3;
  }

  static calculateDelayDays(task: TaskDetail): number {
    if (task.status === 'DONE' || task.status === 'CANCELLED') return 0;
    const dueDate = new Date(task.dueDate);
    if (dueDate < CURRENT_DATE) {
      const diffTime = Math.abs(CURRENT_DATE.getTime() - dueDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  // ENHANCE MOCK DATA WITH DYNAMIC PROPERTIES
  private static enrichTask(task: TaskDetail): TaskDetail {
    return {
      ...task,
      dependencies: task.dependencies.map((dep) => {
        // Find current status of dependent tasks in-memory to dynamically reflect blocking task completions!
        const actualTask = localTasks.find((t) => t.id === dep.id);
        return {
          ...dep,
          status: actualTask ? actualTask.status : dep.status,
        };
      }),
    };
  }

  private static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getTasks(filters: GetTasksFilters = {}): Promise<PaginatedTasks> {
    await this.delay(this.SIMULATED_LATENCY);

    const {
      search = '',
      projectId = 'ALL',
      status = 'ALL',
      priority = 'ALL',
      category = 'ALL',
      sortBy = 'dueDate',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = filters;

    let filtered = localTasks.map((t) => this.enrichTask(t));

    // Apply Search
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.projectName.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query)
      );
    }

    // Apply Project Filter
    if (projectId && projectId !== 'ALL') {
      filtered = filtered.filter((t) => t.projectId === projectId);
    }

    // Apply Status Filter
    if (status && status !== 'ALL') {
      filtered = filtered.filter((t) => t.status === status);
    }

    // Apply Priority Filter
    if (priority && priority !== 'ALL') {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    // Apply Category Filter
    if (category && category !== 'ALL') {
      filtered = filtered.filter((t) => t.category === category);
    }

    // Apply Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'progress') {
        comparison = a.progress - b.progress;
      } else if (sortBy === 'priority') {
        const priorityWeight = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
      } else if (sortBy === 'name') {
        comparison = a.title.localeCompare(b.title);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

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

  static async getTaskById(id: string): Promise<TaskDetail | null> {
    await this.delay(this.SIMULATED_LATENCY);
    const found = localTasks.find((t) => t.id === id);
    if (!found) return null;

    // Fetch up-to-date related project details to bind project contexts
    const proj = await ProjectService.getProjectById(found.projectId);
    
    return this.enrichTask({
      ...found,
      projectName: proj ? proj.name : found.projectName,
      projectStage: proj ? proj.currentStage : found.projectStage,
    });
  }

  static async createTask(
    data: Omit<
      TaskDetail,
      'id' | 'projectName' | 'projectStage' | 'progress' | 'dependencies' | 'comments' | 'attachments' | 'createdAt' | 'assignedDate' | 'startedDate' | 'completedDate'
    >
  ): Promise<TaskDetail> {
    await this.delay(this.SIMULATED_LATENCY);

    // Resolve related project details
    const proj = await ProjectService.getProjectById(data.projectId);
    const projectName = proj ? proj.name : 'Unknown Solar Installation';
    const projectStage = proj ? proj.currentStage : 'PROJECT_CREATED';

    const count = localTasks.length + 1001;
    const id = `t-${count}`;

    const newTask: TaskDetail = {
      ...data,
      id,
      projectName,
      projectStage,
      progress: data.status === 'DONE' ? 100 : 0,
      dependencies: [],
      comments: [
        {
          id: `c-${id}-01`,
          authorName: 'System',
          authorRole: 'System Thread',
          body: `Task successfully cataloged under project ${projectName}.`,
          createdAt: new Date().toISOString(),
        },
      ],
      attachments: [],
      createdAt: new Date().toISOString().split('T')[0],
      assignedDate: data.assigneeName ? new Date().toISOString().split('T')[0] : undefined,
      startedDate: data.status === 'IN_PROGRESS' ? new Date().toISOString().split('T')[0] : undefined,
      completedDate: data.status === 'DONE' ? new Date().toISOString().split('T')[0] : undefined,
    };

    localTasks.push(newTask);
    return newTask;
  }

  static async updateTask(id: string, updates: Partial<TaskDetail>): Promise<TaskDetail | null> {
    await this.delay(this.SIMULATED_LATENCY);

    const index = localTasks.findIndex((t) => t.id === id);
    if (index < 0) return null;

    const current = localTasks[index];
    
    // Auto populate timeline audit dates based on status modifications
    const finalUpdates: Partial<TaskDetail> = { ...updates };
    if (updates.status && updates.status !== current.status) {
      if (updates.status === 'IN_PROGRESS') {
        finalUpdates.startedDate = new Date().toISOString().split('T')[0];
      } else if (updates.status === 'DONE') {
        finalUpdates.completedDate = new Date().toISOString().split('T')[0];
        finalUpdates.progress = 100;
      }
    }

    const updatedTask: TaskDetail = {
      ...current,
      ...finalUpdates,
      id: current.id,
      projectId: current.projectId,
    };

    localTasks[index] = updatedTask;
    return this.enrichTask(updatedTask);
  }

  static async deleteTask(id: string): Promise<boolean> {
    await this.delay(this.SIMULATED_LATENCY);
    const before = localTasks.length;
    localTasks = localTasks.filter((t) => t.id !== id);
    return localTasks.length < before;
  }
}
