import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
          project: {
            orgId:
              user.orgId,
          },

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
      }
    );

  if (!milestone) {
    throw new NotFoundException(
      'Milestone not found'
    );
  }

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
        }
      );

    if (
      !milestone
    ) {
      throw new NotFoundException(
        'Milestone not found'
      );
    }

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
}