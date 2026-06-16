import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import {
  ProjectLifecycleStage,
  SystemRole,
} from '@nature-tek/database';

import {
  advanceLifecycleSchema,
  createProjectSchema,
} from '@nature-tek/shared';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

import type { JwtPayload } from '../auth/jwt.strategy';

import { LifecycleService } from './lifecycle.service';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  RolesGuard
)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly lifecycleService: LifecycleService
  ) {}

  @Get()
  findAll(
    @CurrentUser()
    user: JwtPayload,

    @Query('status')
    status?: string,

    @Query('stage')
    stage?: string
  ) {
    return this.projectsService.findAll(
      user,
      {
        status,
        stage,
      }
    );
  }

  @Roles(
    SystemRole.ADMIN,
    SystemRole.PM
  )
  @Post()
  create(
    @Body()
    body: unknown,

    @CurrentUser()
    user: JwtPayload
  ) {
    const input =
      createProjectSchema.parse(
        body
      );

    return this.projectsService.create(
      input,
      user
    );
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.projectsService.findOne(
      id,
      user
    );
  }

  // ✅ ADD THIS
  @Roles(
    SystemRole.ADMIN,
    SystemRole.PM
  )
  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    body: any,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.projectsService.update(
      id,
      body,
      user
    );
  }

  @Roles(
    SystemRole.ADMIN,
    SystemRole.PM
  )
  @Post(
    ':id/lifecycle/advance'
  )
  advance(
    @Param('id')
    id: string,

    @Body()
    body: unknown,

    @CurrentUser()
    user: JwtPayload
  ) {
    const input =
      advanceLifecycleSchema.parse(
        body
      );

    return this.lifecycleService.advance(
      id,
      input.targetStage as ProjectLifecycleStage,
      user.sub,
      user.role as SystemRole,
      input.reason
    );
  }

  @Roles(
    SystemRole.ADMIN,
    SystemRole.PM
  )
  @Post(
    ':id/lifecycle/rollback'
  )
  rollback(
    @Param('id')
    id: string,

    @Body()
    body: {
      reason: string;
    },

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.lifecycleService.rollback(
      id,
      user.sub,
      user.role as SystemRole,
      body.reason
    );
  }
}