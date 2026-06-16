import { api } from '../lib/api';

export type MilestoneStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'OVERDUE';

export interface MilestoneDetail {
  id: string;
  projectId: string;

  name: string;
  description?: string | null;

  stage: string;
  status: MilestoneStatus;

  targetDate?: string | null;
  completedAt?: string | null;

  createdAt?: string;

  project?: {
    id: string;
    name: string;
    code?: string;
  };
}

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

export interface CreateMilestoneInput {
  name: string;
  description?: string;
  projectId: string;
  stage: string;
  targetDate?: string;
  status?: MilestoneStatus;
}

export interface UpdateMilestoneInput {
  name?: string;
  description?: string;
  projectId?: string;
  stage?: string;
  targetDate?: string;
  status?: MilestoneStatus;
}

export class MilestoneService {
  static async getMilestones(
    filters: GetMilestonesFilters = {}
  ): Promise<PaginatedMilestones> {
    const params =
      new URLSearchParams();

    if (
      filters.projectId &&
      filters.projectId !==
        'ALL'
    ) {
      params.append(
        'projectId',
        filters.projectId
      );
    }

    if (
      filters.status &&
      filters.status !==
        'ALL'
    ) {
      params.append(
        'status',
        filters.status
      );
    }

    const query =
      params.toString();

    const milestones =
      await api<
        MilestoneDetail[]
      >(
        `/milestones${
          query
            ? `?${query}`
            : ''
        }`
      );

    return {
      data: milestones,
      total:
        milestones.length,
      page:
        filters.page ??
        1,
      limit:
        filters.limit ??
        10,
      totalPages: 1,
    };
  }

  static async getMilestoneById(
    id: string
  ): Promise<MilestoneDetail> {
    return api<MilestoneDetail>(
      `/milestones/${id}`
    );
  }

  static async createMilestone(
    data: CreateMilestoneInput
  ): Promise<MilestoneDetail> {
    return api<MilestoneDetail>(
      '/milestones',
      {
        method: 'POST',
        body: JSON.stringify(
          data
        ),
      }
    );
  }

  // EDIT / UPDATE
  static async updateMilestone(
    id: string,
    data: UpdateMilestoneInput
  ): Promise<MilestoneDetail> {
    return api<MilestoneDetail>(
      `/milestones/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(
          data
        ),
      }
    );
  }

  // MARK COMPLETE
  static async markCompleted(
    id: string
  ): Promise<MilestoneDetail> {
    return api<MilestoneDetail>(
      `/milestones/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status:
            'COMPLETED',
        }),
      }
    );
  }

  static async deleteMilestone(
    id: string
  ) {
    return api(
      `/milestones/${id}`,
      {
        method:
          'DELETE',
      }
    );
  }

  static isMilestoneOverdue(
    m: MilestoneDetail
  ): boolean {
    if (
      m.status ===
        'COMPLETED' ||
      !m.targetDate
    ) {
      return false;
    }

    return (
      new Date(
        m.targetDate
      ) < new Date()
    );
  }

  static calculateDelayDays(
    m: MilestoneDetail
  ): number {
    if (
      !m.targetDate ||
      m.status ===
        'COMPLETED'
    ) {
      return 0;
    }

    const target =
      new Date(
        m.targetDate
      );

    const now =
      new Date();

    if (target >= now)
      return 0;

    const diff =
      now.getTime() -
      target.getTime();

    return Math.ceil(
      diff /
        (1000 *
          60 *
          60 *
          24)
    );
  }
}