import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, SystemRole } from '@nature-tek/database';
import { PrismaService } from '../../prisma/prisma.service';

import type { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class MilestonesService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async findAll(
    user: JwtPayload,
    query: {
      projectId?: string;
      status?: string;
    }
  ) {
    return this.prisma.milestone.findMany(
      {
        where: {
          AND: [
            this.visibleMilestoneWhere(
              user
            ),
            {
              project: {
                orgId:
                  user.orgId,
              },
            },
          ],

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
        },

        include: {
          project: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },

        orderBy: {
          createdAt:
            'desc',
        },
      }
    );
  }

  async create(
    body: any,
    user: JwtPayload
  ) {
    const project =
      await this.prisma.project.findFirst(
        {
          where: {
            id:
              body.projectId,

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

    return this.prisma.milestone.create(
      {
        data: {
          projectId:
            body.projectId,

          name:
            body.name,

          description:
            body.description,

          stage:
            body.stage,

          status:
            body.status ??
            'PENDING',

          targetDate:
            body.targetDate
              ? new Date(
                  body.targetDate
                )
              : null,
        },

        include: {
          project: {
            select: {
              id: true,
              name: true,
              code: true,
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
    const milestone =
      await this.prisma.milestone.findFirst(
        {
          where: {
            id,
            AND: [
              this.visibleMilestoneWhere(
                user
              ),
            ],

            project: {
              orgId:
                user.orgId,
            },
          },

          include: {
            project:
              true,
          },
        }
      );

    if (
      !milestone
    ) {
      throw new NotFoundException(
        'Milestone not found'
      );
    }

    return milestone;
  }

  // NEW UPDATE METHOD
  async update(
  id: string,
  body: any,
  user: JwtPayload
) {
  const milestone =
    await this.prisma.milestone.findFirst(
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

  if (!milestone) {
    throw new NotFoundException(
      'Milestone not found'
    );
  }

  this.assertCanUpdateMilestone(
    milestone.project,
    user
  );

  // UPDATE MILESTONE
  const updatedMilestone =
    await this.prisma.milestone.update(
      {
        where: {
          id,
        },

        data: {
          name:
            body.name,

          description:
            body.description,

          stage:
            body.stage,

          status:
            body.status,

          targetDate:
            body.targetDate
              ? new Date(
                  body.targetDate
                )
              : null,

          completedAt:
            body.status ===
            'COMPLETED'
              ? new Date()
              : null,
        },

        include: {
          project: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      }
    );

  // CHECK IF ALL MILESTONES COMPLETED
  const milestones =
    await this.prisma.milestone.findMany(
      {
        where: {
          projectId:
            updatedMilestone.projectId,
        },
      }
    );

  const allCompleted =
    milestones.length > 0 &&
    milestones.every(
      (m) =>
        m.status ===
        'COMPLETED'
    );

  // AUTO COMPLETE PROJECT
  if (allCompleted) {
    await this.prisma.project.update(
      {
        where: {
          id:
            updatedMilestone.projectId,
        },

        data: {
          status:
            'COMPLETED',

          currentStage:
            'COMPLETED',

          actualEnd:
            new Date(),
        },
      }
    );
  }

  return updatedMilestone;
}

  async delete(
    id: string,
    user: JwtPayload
  ) {
    const milestone =
      await this.prisma.milestone.findFirst(
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

    if (
      !milestone
    ) {
      throw new NotFoundException(
        'Milestone not found'
      );
    }

    this.assertCanManageProject(
      milestone.project,
      user
    );

    await this.prisma.milestone.delete(
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

  private visibleMilestoneWhere(
    user: JwtPayload
  ): Prisma.MilestoneWhereInput {
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
      project: {
        tasks: {
          some: {
            assigneeId:
              user.sub,
          },
        },
      },
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
      'You can only manage milestones for your own projects'
    );
  }

  private assertCanUpdateMilestone(
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
      'You are not allowed to update this milestone'
    );
  }
}
