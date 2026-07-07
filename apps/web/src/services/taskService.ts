import { api } from '../lib/api';

export interface TaskDetail {
  id: string;
  title: string;
  description?: string | null;

  projectId: string;
  projectName?: string;

  stage: string;

  status:
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'IN_REVIEW'
    | 'DONE'
    | 'BLOCKED'
    | 'CANCELLED';

  priority:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'URGENT';

  dueAt?: string | null;

  assigneeId?: string | null;

assignee?: {
  id: string;
  firstName: string;
  lastName: string;
};

  createdAt?: string;
}

export interface GetTasksFilters {
  search?: string;
  projectId?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;

  projectId: string;

  stage: string;

  priority:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'URGENT';

  status:
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'IN_REVIEW'
    | 'DONE'
    | 'BLOCKED'
    | 'CANCELLED';

  assigneeId?: string;

  dueAt?: string;
}

export class TaskService {
  static async getTasks(
    filters: GetTasksFilters = {}
  ): Promise<TaskDetail[]> {
    const params =
      new URLSearchParams();

    // SEARCH
    if (
      filters.search?.trim()
    ) {
      params.append(
        'search',
        filters.search
      );
    }

    // PROJECT FILTER
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

    // STATUS FILTER
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

    // PRIORITY FILTER
    if (
      filters.priority &&
      filters.priority !==
        'ALL'
    ) {
      params.append(
        'priority',
        filters.priority
      );
    }

    const query =
      params.toString();

    const tasks =
      await api<any[]>(
        `/tasks${
          query
            ? `?${query}`
            : ''
        }`
      );

    return tasks.map(
      (t) => ({
        id: t.id,

        title:
          t.title,

        description:
          t.description,

        projectId:
          t.projectId,

        projectName:
          t.project
            ?.name ??
          'Unknown Project',

        stage:
          t.stage,

        status:
          t.status,

        priority:
          t.priority,

        dueAt:
          t.dueAt,

        assigneeId:
  t.assigneeId,

assignee:
  t.assignee
    ? {
        id:
          t.assignee.id,

        firstName:
          t.assignee.firstName,

        lastName:
          t.assignee.lastName,
      }
    : undefined,

        createdAt:
          t.createdAt,
      })
    );
  }

  static async getTaskById(
    id: string
  ): Promise<TaskDetail> {
    const t =
      await api<any>(
        `/tasks/${id}`
      );

    return {
      id: t.id,

      title:
        t.title,

      description:
        t.description,

      projectId:
        t.projectId,

      projectName:
        t.project?.name,

      stage:
        t.stage,

      status:
        t.status,

      priority:
        t.priority,

      dueAt:
        t.dueAt,

      assigneeId:
  t.assigneeId,

assignee:
  t.assignee
    ? {
        id:
          t.assignee.id,

        firstName:
          t.assignee.firstName,

        lastName:
          t.assignee.lastName,
      }
    : undefined,

      createdAt:
        t.createdAt,
    };
  }

  static async createTask(
    data: CreateTaskInput
  ): Promise<TaskDetail> {
    const task =
      await api<any>(
        '/tasks',
        {
          method:
            'POST',

          body:
            JSON.stringify(
              data
            ),
        }
      );

    return {
      id: task.id,

      title:
        task.title,

      description:
        task.description,

      projectId:
        task.projectId,

      projectName:
        task.project
          ?.name,

      stage:
        task.stage,

      status:
        task.status,

      priority:
        task.priority,

      dueAt:
        task.dueAt,

      assigneeId:
  task.assigneeId,

assignee:
  task.assignee
    ? {
        id:
          task.assignee.id,

        firstName:
          task.assignee.firstName,

        lastName:
          task.assignee.lastName,
      }
    : undefined,

      createdAt:
        task.createdAt,
    };
  }

  static async updateTask(
    id: string,
    data: Partial<CreateTaskInput>
  ): Promise<TaskDetail> {
    const task =
      await api<any>(
        `/tasks/${id}`,
        {
          method:
            'PATCH',

          body:
            JSON.stringify(
              data
            ),
        }
      );

    return {
      id: task.id,

      title:
        task.title,

      description:
        task.description,

      projectId:
        task.projectId,

      projectName:
        task.project
          ?.name,

      stage:
        task.stage,

      status:
        task.status,

      priority:
        task.priority,

      dueAt:
        task.dueAt,

      assigneeId:
  task.assigneeId,

assignee:
  task.assignee
    ? {
        id:
          task.assignee.id,

        firstName:
          task.assignee.firstName,

        lastName:
          task.assignee.lastName,
      }
    : undefined,

      createdAt:
        task.createdAt,
    };
  }

  static async deleteTask(
    id: string
  ): Promise<void> {
    await api(
      `/tasks/${id}`,
      {
        method:
          'DELETE',
      }
    );
  }

  static async markCompleted(
    id: string
  ): Promise<TaskDetail> {
    return this.updateTask(
      id,
      {
        status:
          'DONE',
      }
    );
  }

  static isOverdue(
    task: TaskDetail
  ): boolean {
    if (
      !task.dueAt
    )
      return false;

    return (
      task.status !==
        'DONE' &&
      new Date(
        task.dueAt
      ) < new Date()
    );
  }

  static calculateDelayDays(
    task: TaskDetail
  ): number {
    if (
      !task.dueAt ||
      task.status ===
        'DONE'
    )
      return 0;

    const due =
      new Date(
        task.dueAt
      );

    const now =
      new Date();

    if (due >= now)
      return 0;

    const diff =
      now.getTime() -
      due.getTime();

    return Math.ceil(
      diff /
        (1000 *
          60 *
          60 *
          24)
    );
  }

  static isDueSoon(
    task: TaskDetail
  ): boolean {
    if (
      !task.dueAt ||
      task.status ===
        'DONE'
    )
      return false;

    const due =
      new Date(
        task.dueAt
      );

    const now =
      new Date();

    const diff =
      due.getTime() -
      now.getTime();

    const days =
      diff /
      (1000 *
        60 *
        60 *
        24);

    return (
      days >= 0 &&
      days <= 3
    );
  }
}