import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
  Project,
  SystemRole,
} from '@nature-tek/database';

import type { CreateProjectInput } from '@nature-tek/shared';
import type { JwtPayload } from '../auth/jwt.strategy';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async findAll(
    user: JwtPayload,
    query: {
      status?: string;
      stage?: string;
    }
  ) {
    const where: Prisma.ProjectWhereInput =
      {
        orgId: user.orgId,
        deletedAt: null,

        ...(query.status && {
          status:
            query.status as Prisma.EnumProjectStatusFilter,
        }),

        ...(query.stage && {
          currentStage:
            query.stage as Prisma.EnumProjectLifecycleStageFilter,
        }),
      };

    if (user.role !== SystemRole.ADMIN) {
      where.OR = [
        {
          pmId: user.sub,
        },
        {
          supervisorId: user.sub,
        },
        {
          members: {
            some: {
              userId: user.sub,
            },
          },
        },
        {
          tasks: {
            some: {
              assigneeId: user.sub,
            },
          },
        },
      ];
    }

    const projects =
      await this.prisma.project.findMany(
        {
          where,

          orderBy: {
            updatedAt:
              'desc',
          },

          include: {
            pm: {
              select: {
                id: true,
                firstName:
                  true,
                lastName:
                  true,
                email: true,
              },
            },

            supervisor: {
              select: {
                id: true,
                firstName:
                  true,
                lastName:
                  true,
                email: true,
              },
            },

            milestones:
              true,
          },
        }
      );

    return projects.map(
      (project) => {
        const totalMilestones =
          project.milestones
            .length;

        const completedMilestones =
          project.milestones.filter(
            (m) =>
              m.status ===
              'COMPLETED'
          ).length;

        const progress =
          totalMilestones >
          0
            ? Math.round(
                (completedMilestones /
                  totalMilestones) *
                  100
              )
            : 0;

        return {
          ...project,
          progress,
          totalMilestones,
          completedMilestones,
        };
      }
    );
  }

  async findOne(
    id: string,
    user: JwtPayload
  ) {
    await this.assertAccess(
      id,
      user
    );

    const project =
      await this.prisma.project.findFirst(
        {
          where: {
            id,
            deletedAt:
              null,
          },

          include: {
            pm: {
              select: {
                id: true,
                firstName:
                  true,
                lastName:
                  true,
                email: true,
              },
            },

            supervisor: {
              select: {
                id: true,
                firstName:
                  true,
                lastName:
                  true,
                email: true,
              },
            },

            members: {
              include: {
                user: {
                  select:
                    {
                      id: true,
                      firstName:
                        true,
                      lastName:
                        true,
                      email: true,
                      role: true,
                    },
                },
              },
            },

            milestones:
              {
                orderBy:
                  {
                    targetDate:
                      'asc',
                  },
              },
          },
        }
      );

    if (!project) {
      throw new NotFoundException(
        'Project not found'
      );
    }

    const totalMilestones =
      project.milestones.length;

    const completedMilestones =
      project.milestones.filter(
        (m) =>
          m.status ===
          'COMPLETED'
      ).length;

    const progress =
      totalMilestones >
      0
        ? Math.round(
            (completedMilestones /
              totalMilestones) *
              100
          )
        : 0;

    return {
      ...project,
      progress,
      totalMilestones,
      completedMilestones,
    };
  }

  async create(
    input: CreateProjectInput,
    user: JwtPayload
  ): Promise<Project> {
    return this.prisma.$transaction(
      async (tx) => {
        const project =
          await tx.project.create(
            {
              data: {
                orgId:
                  user.orgId,

                code:
                  input.code,

                name:
                  input.name,

                description:
                  input.description,

                clientName:
                  input.clientName,

                clientEmail:
                  input.clientEmail,

                clientPhone:
                  input.clientPhone,

                siteAddress:
                  input.siteAddress,

                siteCity:
                  input.siteCity,

                siteState:
                  input.siteState,

                capacityKw:
                  input.capacityKw,

                projectType:
                  input.projectType,

                pmId:
                  user.role ===
                  SystemRole.PM
                    ? user.sub
                    : input.pmId,

                supervisorId:
                  input.supervisorId,

                targetStart:
                  input.targetStart
                    ? new Date(
                        input.targetStart
                      )
                    : undefined,

                targetEnd:
                  input.targetEnd
                    ? new Date(
                        input.targetEnd
                      )
                    : undefined,
              },
            }
          );

        if (
          project.pmId
        ) {
          await tx.projectMember.create(
            {
              data: {
                projectId:
                  project.id,
                userId:
                  project.pmId,
                projectRole:
                  'PM',
              },
            }
          );
        }

        if (
          project.supervisorId &&
          project.supervisorId !==
            project.pmId
        ) {
          await tx.projectMember.create(
            {
              data: {
                projectId:
                  project.id,
                userId:
                  project.supervisorId,
                projectRole:
                  'SUPERVISOR',
              },
            }
          );
        }

        await tx.lifecycleStageHistory.create(
          {
            data: {
              projectId:
                project.id,
              fromStage:
                null,
              toStage:
                'PROJECT_CREATED',
              changedBy:
                user.sub,
              reason:
                'Project created',
            },
          }
        );

        await tx.auditLog.create(
          {
            data: {
              orgId:
                user.orgId,
              actorId:
                user.sub,
              action:
                'CREATE',
              entityType:
                'project',
              entityId:
                project.id,
              metadata:
                {
                  code:
                    project.code,
                },
            },
          }
        );

        return project;
      }
    );
  }

  // UPDATE PROJECT
  async update(
    id: string,
    body: any,
    user: JwtPayload
  ) {
    await this.assertAccess(
      id,
      user
    );

    const existing =
      await this.prisma.project.findFirst(
        {
          where: {
            id,
            deletedAt: null,
          },
        }
      );

    if (!existing) {
      throw new NotFoundException(
        'Project not found'
      );
    }

    if (
      user.role !== SystemRole.ADMIN &&
      (user.role !== SystemRole.PM ||
        existing.pmId !== user.sub)
    ) {
      throw new ForbiddenException(
        'You can only manage your own projects'
      );
    }

    const markingComplete =
      body.status === 'COMPLETED' ||
      body.currentStage === 'COMPLETED';

    if (markingComplete) {
      const milestones =
        await this.prisma.milestone.findMany(
          {
            where: {
              projectId: id,
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

      if (!allCompleted) {
        throw new BadRequestException(
          'All milestones must be completed before the project can be marked complete'
        );
      }
    }

    return this.prisma.$transaction(
      async (tx) => {
        const updated =
          await tx.project.update(
      {
        where: { id },

        data: {
          name:
            body.name ??
            existing.name,

          description:
            body.description ??
            existing.description,

          clientName:
            body.clientName ??
            existing.clientName,

          clientEmail:
            body.clientEmail ??
            existing.clientEmail,

          clientPhone:
            body.clientPhone ??
            existing.clientPhone,

          siteAddress:
            body.siteAddress ??
            existing.siteAddress,

          siteCity:
            body.siteCity ??
            existing.siteCity,

          siteState:
            body.siteState ??
            existing.siteState,

          capacityKw:
            body.capacityKw ??
            existing.capacityKw,

          projectType:
            body.projectType ??
            existing.projectType,

          pmId:
            body.pmId ??
            existing.pmId,

          supervisorId:
            body.supervisorId ??
            existing.supervisorId,

          status:
            markingComplete
              ? 'COMPLETED'
              : (body.status ??
                existing.status),

          currentStage:
            markingComplete
              ? 'COMPLETED'
              : (body.currentStage ??
                existing.currentStage),

          actualEnd:
            markingComplete
              ? new Date()
              : existing.actualEnd,
        },

        include: {
          milestones: true,

          pm: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },

          supervisor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }
          );

        if (body.pmId) {
          await tx.projectMember.upsert(
            {
              where: {
                projectId_userId: {
                  projectId: id,
                  userId:
                    body.pmId,
                },
              },
              create: {
                projectId: id,
                userId:
                  body.pmId,
                projectRole:
                  'PM',
              },
              update: {
                projectRole:
                  'PM',
              },
            }
          );
        }

        if (body.supervisorId) {
          await tx.projectMember.upsert(
            {
              where: {
                projectId_userId: {
                  projectId: id,
                  userId:
                    body.supervisorId,
                },
              },
              create: {
                projectId: id,
                userId:
                  body.supervisorId,
                projectRole:
                  'SUPERVISOR',
              },
              update: {
                projectRole:
                  'SUPERVISOR',
              },
            }
          );
        }

        return updated;
      }
    );
  }

  private async assertAccess(
    projectId: string,
    user: JwtPayload
  ) {
    if (
      user.role ===
      SystemRole.ADMIN
    ) {
      return;
    }

    const project =
      await this.prisma.project.findFirst(
        {
          where: {
            id: projectId,
            orgId: user.orgId,
            deletedAt: null,
            OR: [
              {
                pmId: user.sub,
              },
              {
                supervisorId: user.sub,
              },
              {
                members: {
                  some: {
                    userId:
                      user.sub,
                  },
                },
              },
              {
                tasks: {
                  some: {
                    assigneeId:
                      user.sub,
                  },
                },
              },
            ],
          },
        }
      );

    if (!project) {
      throw new NotFoundException(
        'Project not found'
      );
    }
  }
}
