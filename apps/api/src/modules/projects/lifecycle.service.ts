import { BadRequestException, Injectable } from '@nestjs/common';
import { AuditAction, Project, ProjectLifecycleStage, SystemRole } from '@nature-tek/database';
import { getNextStage, getPreviousStage, type LifecycleStage } from '@nature-tek/shared';
import { PrismaService } from '../../prisma/prisma.service';

export interface StageAdvanceBlocker {
  field: string;
  message: string;
}

@Injectable()
export class LifecycleService {
  constructor(private readonly prisma: PrismaService) {}

  async validateAdvance(projectId: string, targetStage: ProjectLifecycleStage) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: true,
        documents: { include: { versions: true } },
        approvalRequests: { where: { status: 'PENDING' } },
      },
    });

    if (!project) throw new BadRequestException('Project not found');
    if (project.status === 'COMPLETED' || project.currentStage === 'COMPLETED') {
      throw new BadRequestException('Project is already completed');
    }

    const expectedNext = getNextStage(project.currentStage as LifecycleStage);
    if (expectedNext !== targetStage) {
      throw new BadRequestException(
        `Invalid transition: expected ${expectedNext ?? 'none'}, got ${targetStage}`,
      );
    }

    const blockers: StageAdvanceBlocker[] = [];

    const stageMilestones = project.milestones.filter((m) => m.stage === project.currentStage);
    const incomplete = stageMilestones.filter((m) => m.status !== 'COMPLETED');
    if (incomplete.length > 0) {
      blockers.push({
        field: 'milestones',
        message: `${incomplete.length} milestone(s) incomplete for ${project.currentStage}`,
      });
    }

    if (project.approvalRequests.length > 0) {
      blockers.push({
        field: 'approvals',
        message: `${project.approvalRequests.length} pending approval(s)`,
      });
    }

    const requirement = await this.prisma.stageRequirement.findUnique({
      where: { stage: project.currentStage },
    });

    if (requirement?.requiredDocCats.length) {
      for (const cat of requirement.requiredDocCats) {
        const doc = project.documents.find(
          (d) => d.category === cat && d.versions.length > 0,
        );
        if (!doc) {
          blockers.push({
            field: 'documents',
            message: `Missing required document category: ${cat}`,
          });
        }
      }
    }

    return { project, blockers };
  }

  async advance(
    projectId: string,
    targetStage: ProjectLifecycleStage,
    userId: string,
    userRole: SystemRole,
    reason?: string,
  ): Promise<Project> {
    if (!['ADMIN', 'PM'].includes(userRole)) {
      throw new BadRequestException('Only Admin or PM can advance lifecycle');
    }

    const { project, blockers } = await this.validateAdvance(projectId, targetStage);
    if (blockers.length > 0) {
      throw new BadRequestException({
        type: 'stage_advance_blocked',
        title: 'Stage Advance Blocked',
        errors: blockers,
      });
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const proj = await tx.project.update({
        where: { id: projectId },
        data: {
          currentStage: targetStage,
          status: targetStage === 'COMPLETED' ? 'COMPLETED' : project.status,
          actualEnd: targetStage === 'COMPLETED' ? new Date() : project.actualEnd,
        },
      });

      await tx.lifecycleStageHistory.create({
        data: {
          projectId,
          fromStage: project.currentStage,
          toStage: targetStage,
          changedBy: userId,
          reason,
        },
      });

      await tx.auditLog.create({
        data: {
          orgId: project.orgId,
          actorId: userId,
          action: AuditAction.STAGE_ADVANCE,
          entityType: 'project',
          entityId: projectId,
          metadata: { from: project.currentStage, to: targetStage, reason },
        },
      });

      return proj;
    });

    return updated;
  }

  async rollback(
    projectId: string,
    userId: string,
    userRole: SystemRole,
    reason: string,
  ): Promise<Project> {
    if (!['ADMIN', 'PM'].includes(userRole)) {
      throw new BadRequestException('Only Admin or PM can rollback lifecycle');
    }

    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new BadRequestException('Project not found');
    if (project.currentStage === 'COMPLETED') {
      throw new BadRequestException('Cannot rollback completed project without Admin reopen');
    }

    const previous = getPreviousStage(project.currentStage as LifecycleStage);
    if (!previous) throw new BadRequestException('No previous stage available');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: projectId },
        data: { currentStage: previous as ProjectLifecycleStage },
      });

      await tx.lifecycleStageHistory.create({
        data: {
          projectId,
          fromStage: project.currentStage,
          toStage: previous as ProjectLifecycleStage,
          changedBy: userId,
          reason,
        },
      });

      await tx.auditLog.create({
        data: {
          orgId: project.orgId,
          actorId: userId,
          action: AuditAction.STAGE_ROLLBACK,
          entityType: 'project',
          entityId: projectId,
          metadata: { from: project.currentStage, to: previous, reason },
        },
      });

      return updated;
    });
  }
}
