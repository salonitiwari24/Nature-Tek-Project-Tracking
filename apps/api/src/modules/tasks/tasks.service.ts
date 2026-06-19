import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, SystemRole } from '@nature-tek/database';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async findAll(
    user: JwtPayload,
    query: {
      search?: string;
      projectId?: string;
      status?: string;
      priority?: string;
    }
  ) {
    return this.prisma.task.findMany({
      where: {
        AND: [
          this.visibleTaskWhere(user),
          {
            project: {
              orgId: user.orgId,
            },
          },
        ],

        ...(query.search
          ? {
              OR: [
                {
                  title: {
                    contains:
                      query.search,
                    mode:
                      'insensitive',
                  },
                },

                {
                  description:
                    {
                      contains:
                        query.search,
                      mode:
                        'insensitive',
                    },
                },
              ],
            }
          : {}),

        ...(query.projectId
          ? {
              projectId:
                query.projectId,
            }
          : {}),

        ...(query.status &&
        query.status !==
          'ALL'
          ? {
              status:
                query.status as any,
            }
          : {}),

        ...(query.priority &&
        query.priority !==
          'ALL'
          ? {
              priority:
                query.priority as any,
            }
          : {}),
      },

      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async create(
    body: any,
    user: JwtPayload
  ) {
    const project =
      await this.prisma.project.findFirst(
        {
          where: {
            id: body.projectId,
            orgId:
              user.orgId,
          },
        }
      );

    if (!project) {
      throw new NotFoundException(
        'Project not found'
      );
    }

    this.assertCanManageProject(
      project,
      user
    );

    return this.prisma.task.create(
      {
        data: {
          projectId:
            body.projectId,

          title:
            body.title,

          description:
            body.description,

          stage:
            body.stage,

          priority:
            body.priority ??
            'MEDIUM',

          status:
            body.status ??
            'NOT_STARTED',

          assigneeId:
            body.assigneeId ??
            null,

          dueAt:
            body.dueAt
              ? new Date(
                  body.dueAt
                )
              : null,
        },

        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },

          assignee: {
            select: {
              id: true,
              firstName:
                true,
              lastName:
                true,
            },
          },
        },
      }
    );
  }

  async findOne(
    id: string,
    user: JwtPayload
  ) {
    const task =
      await this.prisma.task.findFirst(
        {
          where: {
            id,
            AND: [
              this.visibleTaskWhere(
                user
              ),
              {
                project: {
                  orgId:
                    user.orgId,
                },
              },
            ],
          },

          include: {
            project:
              true,
            assignee:
              true,
          },
        }
      );

    if (!task) {
      throw new NotFoundException(
        'Task not found'
      );
    }

    return task;
  }

  async update(
    id: string,
    body: any,
    user: JwtPayload
  ) {
    const task =
      await this.prisma.task.findFirst(
        {
          where: {
            id,

            project: {
              orgId:
                user.orgId,
            },
          },

          include: {
            project: true,
          },
        }
      );

    if (!task) {
      throw new NotFoundException(
        'Task not found'
      );
    }

    this.assertCanUpdateTask(
      task.project,
      user
    );

    return this.prisma.task.update(
      {
        where: {
          id,
        },

        data: {
          title:
            body.title,

          description:
            body.description,

          stage:
            body.stage,

          status:
            body.status,

          priority:
            body.priority,

          assigneeId:
            body.assigneeId,

          dueAt:
            body.dueAt
              ? new Date(
                  body.dueAt
                )
              : null,
        },

        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },

          assignee: {
            select: {
              id: true,
              firstName:
                true,
              lastName:
                true,
            },
          },
        },
      }
    );
  }

  async delete(
    id: string,
    user: JwtPayload
  ) {
    const task =
      await this.prisma.task.findFirst(
        {
          where: {
            id,

            project: {
              orgId:
                user.orgId,
            },
          },

          include: {
            project: true,
          },
        }
      );

    if (!task) {
      throw new NotFoundException(
        'Task not found'
      );
    }

    this.assertCanManageProject(
      task.project,
      user
    );

    await this.prisma.task.delete(
      {
        where: {
          id,
        },
      }
    );

    return {
      success: true,
    };
  }

  private visibleTaskWhere(
    user: JwtPayload
  ): Prisma.TaskWhereInput {
    if (
      user.role ===
      SystemRole.ADMIN
    ) {
      return {};
    }

    if (
      user.role ===
      SystemRole.PM
    ) {
      return {
        project: {
          OR: [
            {
              pmId: user.sub,
            },
            {
              members: {
                some: {
                  userId:
                    user.sub,
                },
              },
            },
          ],
        },
      };
    }

    if (
      user.role ===
      SystemRole.SUPERVISOR
    ) {
      return {
        project: {
          OR: [
            {
              supervisorId:
                user.sub,
            },
            {
              members: {
                some: {
                  userId:
                    user.sub,
                },
              },
            },
          ],
        },
      };
    }

    return {
      assigneeId: user.sub,
    };
  }

  private assertCanManageProject(
    project: { pmId: string | null },
    user: JwtPayload
  ) {
    if (
      user.role ===
      SystemRole.ADMIN
    ) {
      return;
    }

    if (
      user.role ===
        SystemRole.PM &&
      project.pmId === user.sub
    ) {
      return;
    }

    throw new ForbiddenException(
      'You can only manage your own project work'
    );
  }

  private assertCanUpdateTask(
    project: {
      pmId: string | null;
      supervisorId: string | null;
    },
    user: JwtPayload
  ) {
    if (
      user.role ===
      SystemRole.ADMIN
    ) {
      return;
    }

    if (
      user.role ===
        SystemRole.PM &&
      project.pmId === user.sub
    ) {
      return;
    }

    if (
      user.role ===
        SystemRole.SUPERVISOR &&
      project.supervisorId ===
        user.sub
    ) {
      return;
    }

    throw new ForbiddenException(
      'You are not allowed to update this task'
    );
  }
}
