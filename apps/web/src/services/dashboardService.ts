import { ProjectService } from './projectService';
import { MilestoneService } from './milestoneService';

export interface DashboardStats {
  totalProjects: number;
  totalProjectsTrend: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };

  activeProjects: number;
  activeProjectsTrend: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };

  completedProjects: number;
  completedProjectsTrend: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };

  delayedProjects: number;
  delayedProjectsTrend: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
}

export interface DashboardAlert {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;

  type:
    | 'DELAYED_PROJECT'
    | 'UPCOMING_DEADLINE'
    | 'PENDING_APPROVAL';

  title: string;
  description: string;

  severity:
    | 'high'
    | 'medium'
    | 'low';

  dueDate?: string;
}

export interface MonthlyCompletion {
  month: string;
  completed: number;
}

export class DashboardService {
  static async getStats(
    projectType?: string
  ): Promise<DashboardStats> {
    let projects =
      await ProjectService.getProjects();

    if (
      projectType &&
      projectType !== 'ALL'
    ) {
      projects = projects.filter(
        (p) =>
          p.projectType ===
          projectType
      );
    }

    const totalProjects =
      projects.length;

    const activeProjects =
      projects.filter(
        (p) =>
          p.status ===
          'ACTIVE'
      ).length;

    const completedProjects =
      projects.filter(
        (p) =>
          p.status ===
          'COMPLETED'
      ).length;

    const delayedProjects =
      projects.filter(
        (p) =>
          ProjectService.calculateDelayDays(
            p
          ) > 0
      ).length;

    return {
      totalProjects,

      totalProjectsTrend:
        {
          value:
            'Live data',
          type:
            'neutral',
        },

      activeProjectsTrend:
        {
          value:
            'Live data',
          type:
            'neutral',
        },

      completedProjectsTrend:
        {
          value:
            'Live data',
          type:
            'neutral',
        },

      delayedProjectsTrend:
        {
          value:
            delayedProjects >
            0
              ? `${delayedProjects} delayed`
              : 'No delays',

          type:
            delayedProjects >
            0
              ? 'down'
              : 'neutral',
        },

      activeProjects,
      completedProjects,
      delayedProjects,
    };
  }

  static async getRecentProjects(
    projectType?: string
  ) {
    let projects =
      await ProjectService.getProjects();

    if (
      projectType &&
      projectType !== 'ALL'
    ) {
      projects = projects.filter(
        (p) =>
          p.projectType ===
          projectType
      );
    }

    return [...projects]
      .sort(
        (a, b) =>
          new Date(
            b.targetStart ??
              0
          ).getTime() -
          new Date(
            a.targetStart ??
              0
          ).getTime()
      )
      .slice(0, 6);
  }

  static async getMonthlyCompletions(): Promise<
    MonthlyCompletion[]
  > {
    const projects =
      await ProjectService.getProjects();

    const monthlyMap =
      new Map<
        string,
        number
      >();

    projects.forEach(
      (project) => {
        if (
          project.status !==
            'COMPLETED' ||
          !project.targetEnd
        )
          return;

        const date =
          new Date(
            project.targetEnd
          );

        const month =
          date.toLocaleString(
            'default',
            {
              month:
                'short',
            }
          );

        monthlyMap.set(
          month,
          (monthlyMap.get(
            month
          ) ?? 0) + 1
        );
      }
    );

    return Array.from(
      monthlyMap.entries()
    ).map(
      ([month, completed]) => ({
        month,
        completed,
      })
    );
  }

  static async getAlerts(
    projectType?: string
  ): Promise<
    DashboardAlert[]
  > {
    let projects =
      await ProjectService.getProjects();

    const milestonesResponse =
      await MilestoneService.getMilestones();

    const milestones =
      milestonesResponse.data;

    if (
      projectType &&
      projectType !== 'ALL'
    ) {
      projects = projects.filter(
        (p) =>
          p.projectType ===
          projectType
      );
    }

    const alerts: DashboardAlert[] =
      [];

    // DELAYED PROJECTS
    projects.forEach(
      (project) => {
        const delay =
          ProjectService.calculateDelayDays(
            project
          );

        if (
          delay > 0
        ) {
          alerts.push({
            id: `delay-${project.id}`,

            projectId:
              project.id,

            projectCode:
              project.code,

            projectName:
              project.name,

            type:
              'DELAYED_PROJECT',

            title:
              'Project Delayed',

            description: `Project overdue by ${delay} day(s)`,

            severity:
              'high',
          });
        }
      }
    );

    // UPCOMING MILESTONES
    milestones.forEach(
      (milestone) => {
        if (
          milestone.status ===
            'COMPLETED' ||
          !milestone.targetDate
        )
          return;

        const due =
          new Date(
            milestone.targetDate
          );

        const now =
          new Date();

        const diffDays =
          (due.getTime() -
            now.getTime()) /
          (1000 *
            60 *
            60 *
            24);

        if (
          diffDays >=
            0 &&
          diffDays <= 7
        ) {
          alerts.push({
            id: `milestone-${milestone.id}`,

            projectId:
              milestone.projectId,

            projectCode:
              milestone.project
                ?.code ??
              'N/A',

            projectName:
              milestone.project
                ?.name ??
              'Unknown',

            type:
              'UPCOMING_DEADLINE',

            title:
              milestone.name,

            description:
              'Milestone deadline approaching',

            severity:
              'medium',

            dueDate:
              milestone.targetDate,
          });
        }
      }
    );

    return alerts;
  }

  static async getStatusDistribution(
    projectType?: string
  ) {
    let projects =
      await ProjectService.getProjects();

    if (
      projectType &&
      projectType !== 'ALL'
    ) {
      projects = projects.filter(
        (p) =>
          p.projectType ===
          projectType
      );
    }

    const planning =
      projects.filter(
        (p) =>
          [
            'PROJECT_CREATED',
            'SITE_SURVEY',
            'DESIGN_APPROVAL',
          ].includes(
            p.currentStage
          )
      ).length;

    const inProgress =
      projects.filter(
        (p) =>
          [
            'MATERIAL_PROCUREMENT',
            'MATERIAL_DELIVERY',
            'STRUCTURE_INSTALLATION',
            'PANEL_MOUNTING',
            'ELECTRICAL_WIRING',
            'INVERTER_INSTALLATION',
            'TESTING_COMMISSIONING',
          ].includes(
            p.currentStage
          )
      ).length;

    const delayed =
      projects.filter(
        (p) =>
          ProjectService.calculateDelayDays(
            p
          ) > 0
      ).length;

    const completed =
      projects.filter(
        (p) =>
          p.status ===
          'COMPLETED'
      ).length;

    return [
      {
        name:
          'Planning',
        value:
          planning,
        color:
          '#f59e0b',
      },
      {
        name:
          'In Progress',
        value:
          inProgress,
        color:
          '#6366f1',
      },
      {
        name:
          'Delayed',
        value:
          delayed,
        color:
          '#ef4444',
      },
      {
        name:
          'Completed',
        value:
          completed,
        color:
          '#16a34a',
      },
    ];
  }
}