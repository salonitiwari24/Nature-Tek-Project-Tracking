import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import type { JwtPayload } from '../auth/jwt.strategy';
import { SystemRole } from '@nature-tek/database';

import { MilestonesService } from './milestones.service';

@ApiTags('milestones')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  RolesGuard
)
@Controller('milestones')
export class MilestonesController {
  constructor(
    private readonly milestonesService: MilestonesService
  ) {}

  @Get()
  findAll(
    @CurrentUser()
    user: JwtPayload,

    @Query('projectId')
    projectId?: string,

    @Query('status')
    status?: string
  ) {
    return this.milestonesService.findAll(
      user,
      {
        projectId,
        status,
      }
    );
  }

  @Post()
  @Roles(SystemRole.ADMIN, SystemRole.PM)
  create(
    @Body()
    body: any,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.milestonesService.create(
      body,
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
    return this.milestonesService.findOne(
      id,
      user
    );
  }

  // UPDATE MILESTONE
  @Patch(':id')
  @Roles(SystemRole.ADMIN, SystemRole.PM, SystemRole.SUPERVISOR)
  update(
    @Param('id')
    id: string,

    @Body()
    body: any,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.milestonesService.update(
      id,
      body,
      user
    );
  }

  @Delete(':id')
  @Roles(SystemRole.ADMIN, SystemRole.PM)
  delete(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.milestonesService.delete(
      id,
      user
    );
  }
}
