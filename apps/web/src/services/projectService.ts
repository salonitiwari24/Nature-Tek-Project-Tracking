import { api } from '../lib/api';

export interface ProjectDetail {
  id: string;
  code: string;
  name: string;
  description?: string | null;

  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;

  siteAddress: string;
  siteCity?: string | null;
  siteState?: string | null;

  capacityKw: number;

  projectType:
    | 'RESIDENTIAL'
    | 'COMMERCIAL'
    | 'INDUSTRIAL';

  status:
    | 'ACTIVE'
    | 'COMPLETED'
    | 'ON_HOLD'
    | 'ARCHIVED';

  currentStage: string;

  pmId?: string | null;
  supervisorId?: string | null;

  targetStart?: string | null;
  targetEnd?: string | null;

  progress?: number;
  totalMilestones?: number;
  completedMilestones?: number;

  pm?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  } | null;

  supervisor?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  } | null;

  milestones?: {
    id: string;
    name: string;
    stage: string;
    status:
      | 'PENDING'
      | 'IN_PROGRESS'
      | 'COMPLETED'
      | 'OVERDUE';
    targetDate?: string | null;
    completedAt?: string | null;
  }[];
}

export interface GetProjectsFilters {
  search?: string;
  status?: string;
  type?: string;

  sortBy?:
    | 'date'
    | 'progress'
    | 'capacity'
    | 'name';

  sortOrder?:
    | 'asc'
    | 'desc';

  page?: number;
  limit?: number;
}

export interface CreateProjectInput {
  code: string;
  name: string;
  description?: string;

  clientName: string;
  clientEmail?: string;
  clientPhone?: string;

  siteAddress: string;
  siteCity?: string;
  siteState?: string;

  capacityKw: number;

  projectType:
    | 'RESIDENTIAL'
    | 'COMMERCIAL'
    | 'INDUSTRIAL';

  pmId?: string;
  supervisorId?: string;

  targetStart?: string;
  targetEnd?: string;
}

export class ProjectService {
  static async getProjects(
    filters: GetProjectsFilters = {}
  ): Promise<ProjectDetail[]> {
    const params =
      new URLSearchParams();

    if (
      filters.status &&
      filters.status !== 'ALL'
    ) {
      params.append(
        'status',
        filters.status
      );
    }

    const query =
      params.toString();

    const raw =
      await api<any[]>(
        `/projects${
          query
            ? `?${query}`
            : ''
        }`
      );

    return raw.map(
      (p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description:
          p.description,

        clientName:
          p.clientName,
        clientEmail:
          p.clientEmail,
        clientPhone:
          p.clientPhone,

        siteAddress:
          p.siteAddress,
        siteCity:
          p.siteCity,
        siteState:
          p.siteState,

        capacityKw:
          Number(
            p.capacityKw
          ),

        projectType:
          p.projectType,

        status:
          p.status,

        currentStage:
          p.currentStage,

        pmId: p.pmId,
        supervisorId:
          p.supervisorId,

        targetStart:
          p.targetStart,
        targetEnd:
          p.targetEnd,

        progress:
          p.progress ?? 0,

        totalMilestones:
          p.totalMilestones ??
          0,

        completedMilestones:
          p.completedMilestones ??
          0,

        pm: p.pm ?? null,

        supervisor:
          p.supervisor ?? null,

        milestones:
          p.milestones ?? [],
      })
    );
  }

  static async getProjectById(
    id: string
  ): Promise<ProjectDetail> {
    const p =
      await api<any>(
        `/projects/${id}`
      );

    return {
      id: p.id,
      code: p.code,
      name: p.name,
      description:
        p.description,

      clientName:
        p.clientName,
      clientEmail:
        p.clientEmail,
      clientPhone:
        p.clientPhone,

      siteAddress:
        p.siteAddress,
      siteCity:
        p.siteCity,
      siteState:
        p.siteState,

      capacityKw:
        Number(
          p.capacityKw
        ),

      projectType:
        p.projectType,

      status:
        p.status,

      currentStage:
        p.currentStage,

      pmId: p.pmId,
      supervisorId:
        p.supervisorId,

      targetStart:
        p.targetStart,
      targetEnd:
        p.targetEnd,

      progress:
        p.progress ?? 0,

      totalMilestones:
        p.totalMilestones ??
        0,

      completedMilestones:
        p.completedMilestones ??
        0,

      pm: p.pm ?? null,

      supervisor:
        p.supervisor ?? null,

      milestones:
        p.milestones ?? [],
    };
  }

  static async createProject(
    data: CreateProjectInput
  ): Promise<ProjectDetail> {
    return api<ProjectDetail>(
      '/projects',
      {
        method: 'POST',
        body: JSON.stringify(
          data
        ),
      }
    );
  }

  // ✅ FIXED: UPDATE PROJECT
  static async updateProject(
    id: string,
    data: Partial<CreateProjectInput>
  ): Promise<ProjectDetail> {
    return api<ProjectDetail>(
      `/projects/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(
          data
        ),
      }
    );
  }

  static async markCompleted(
    id: string
  ): Promise<ProjectDetail> {
    return api<ProjectDetail>(
      `/projects/${id}`,
      {
        method: 'PATCH',

        body: JSON.stringify(
          {
            status:
              'COMPLETED',

            currentStage:
              'COMPLETED',
          }
        ),
      }
    );
  }

  static calculateProgress(
    project: ProjectDetail
  ): number {
    // Use server progress
    if (
      project.progress !==
      undefined
    ) {
      return project.progress;
    }

    if (
      project.status ===
      'COMPLETED'
    ) {
      return 100;
    }

    switch (
      project.currentStage
    ) {
      case 'PROJECT_CREATED':
        return 5;

      case 'SITE_SURVEY':
        return 15;

      case 'DESIGN_APPROVAL':
        return 25;

      case 'MATERIAL_PROCUREMENT':
        return 35;

      case 'MATERIAL_DELIVERY':
        return 45;

      case 'STRUCTURE_INSTALLATION':
        return 55;

      case 'PANEL_MOUNTING':
        return 65;

      case 'ELECTRICAL_WIRING':
        return 75;

      case 'INVERTER_INSTALLATION':
        return 85;

      case 'TESTING_COMMISSIONING':
        return 92;

      case 'GRID_APPROVAL':
        return 97;

      case 'PROJECT_HANDOVER':
        return 99;

      case 'COMPLETED':
        return 100;

      default:
        return 0;
    }
  }

  static calculateDelayDays(
    project: ProjectDetail
  ): number {
    if (
      !project.targetEnd
    )
      return 0;

    if (
      project.status ===
      'COMPLETED'
    )
      return 0;

    const currentDate =
      new Date();

    const targetEnd =
      new Date(
        project.targetEnd
      );

    if (
      targetEnd <
      currentDate
    ) {
      const diff =
        currentDate.getTime() -
        targetEnd.getTime();

      return Math.ceil(
        diff /
          (1000 *
            60 *
            60 *
            24)
      );
    }

    return 0;
  }
}