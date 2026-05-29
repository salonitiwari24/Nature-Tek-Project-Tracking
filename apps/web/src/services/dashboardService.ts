import {
  mockProjects,
  mockMonthlyCompletions,
  mockAlerts,
  Project,
  MonthlyCompletion,
  DashboardAlert,
} from '../mocks/dashboardMockData';

// Simulated current date for date logic: May 29, 2026
const CURRENT_DATE = new Date('2026-05-29T13:00:00Z');

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface DashboardStats {
  totalProjects: number;
  totalProjectsTrend: { value: string; type: 'up' | 'down' | 'neutral' };
  activeProjects: number;
  activeProjectsTrend: { value: string; type: 'up' | 'down' | 'neutral' };
  completedProjects: number;
  completedProjectsTrend: { value: string; type: 'up' | 'down' | 'neutral' };
  delayedProjects: number;
  delayedProjectsTrend: { value: string; type: 'up' | 'down' | 'neutral' };
}

export class DashboardService {
  private static SIMULATED_LATENCY = 350;

  static async getStats(projectType?: string): Promise<DashboardStats> {
    await delay(this.SIMULATED_LATENCY);

    let projects = mockProjects;
    if (projectType && projectType !== 'ALL') {
      projects = mockProjects.filter((p) => p.projectType === projectType);
    }

    const total = projects.length;
    const active = projects.filter((p) => p.status === 'ACTIVE').length;
    const completed = projects.filter((p) => p.status === 'COMPLETED').length;

    // A project is delayed if status is not COMPLETED and targetEnd has passed the current date
    const delayed = projects.filter(
      (p) =>
        p.status !== 'COMPLETED' &&
        p.status !== 'ARCHIVED' &&
        new Date(p.targetEnd) < CURRENT_DATE
    ).length;

    return {
      totalProjects: total,
      totalProjectsTrend: { value: '+4 this quarter', type: 'up' },
      activeProjects: active,
      activeProjectsTrend: { value: '+2 from last month', type: 'up' },
      completedProjects: completed,
      completedProjectsTrend: { value: '+3 this month', type: 'up' },
      delayedProjects: delayed,
      delayedProjectsTrend: {
        value: delayed > 0 ? `${delayed} high priority` : '0 issues',
        type: delayed > 0 ? 'down' : 'neutral',
      },
    };
  }

  static async getRecentProjects(projectType?: string): Promise<Project[]> {
    await delay(this.SIMULATED_LATENCY);

    let projects = mockProjects;
    if (projectType && projectType !== 'ALL') {
      projects = mockProjects.filter((p) => p.projectType === projectType);
    }

    // Sort by targetStart descending, limit to 6
    return [...projects]
      .sort((a, b) => new Date(b.targetStart).getTime() - new Date(a.targetStart).getTime())
      .slice(0, 6);
  }

  static async getMonthlyCompletions(): Promise<MonthlyCompletion[]> {
    await delay(this.SIMULATED_LATENCY);
    return mockMonthlyCompletions;
  }

  static async getAlerts(projectType?: string): Promise<DashboardAlert[]> {
    await delay(this.SIMULATED_LATENCY);

    let alerts = mockAlerts;
    if (projectType && projectType !== 'ALL') {
      // Find matching projects for the type, filter alerts linked to these projects
      const projectIds = new Set(
        mockProjects.filter((p) => p.projectType === projectType).map((p) => p.id)
      );
      alerts = mockAlerts.filter((a) => projectIds.has(a.projectId));
    }

    return alerts;
  }

  static async getStatusDistribution(projectType?: string) {
    await delay(this.SIMULATED_LATENCY);

    let projects = mockProjects;
    if (projectType && projectType !== 'ALL') {
      projects = mockProjects.filter((p) => p.projectType === projectType);
    }

    // Pie Chart status groupings:
    // Planning: PROJECT_CREATED, SITE_SURVEY, DESIGN_APPROVAL
    // In Progress: MATERIAL_PROCUREMENT, MATERIAL_DELIVERY, STRUCTURE_INSTALLATION, PANEL_MOUNTING, ELECTRICAL_WIRING, INVERTER_INSTALLATION, TESTING_COMMISSIONING
    // Delayed: Active/On Hold project where targetEnd has passed CURRENT_DATE
    // Completed: GRID_APPROVAL, PROJECT_HANDOVER, COMPLETED

    let planning = 0;
    let inProgress = 0;
    let delayed = 0;
    let completed = 0;

    projects.forEach((p) => {
      if (p.status === 'COMPLETED') {
        completed++;
        return;
      }

      // Check if delayed
      if (new Date(p.targetEnd) < CURRENT_DATE && p.status !== 'ARCHIVED') {
        delayed++;
        return;
      }

      const stage = p.currentStage;
      if (
        stage === 'PROJECT_CREATED' ||
        stage === 'SITE_SURVEY' ||
        stage === 'DESIGN_APPROVAL'
      ) {
        planning++;
      } else if (
        stage === 'GRID_APPROVAL' ||
        stage === 'PROJECT_HANDOVER' ||
        stage === 'COMPLETED'
      ) {
        completed++;
      } else {
        inProgress++;
      }
    });

    return [
      { name: 'Planning', value: planning, color: '#f59e0b' },      // Amber
      { name: 'In Progress', value: inProgress, color: '#6366f1' },  // Indigo
      { name: 'Delayed', value: delayed, color: '#ef4444' },          // Red
      { name: 'Completed', value: completed, color: '#16a34a' },      // Green (Brand-600)
    ];
  }
}
