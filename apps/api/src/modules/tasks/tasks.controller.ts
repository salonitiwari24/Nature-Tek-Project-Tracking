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
import { RolesGuard } from '../auth/roles.guard';
import type { JwtPayload } from '../auth/jwt.strategy';

import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  RolesGuard
)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService
  ) {}

  @Get()
  findAll(
    @CurrentUser()
    user: JwtPayload,

    @Query('search')
    search?: string,

    @Query('projectId')
    projectId?: string,

    @Query('status')
    status?: string,

    @Query('priority')
    priority?: string
  ) {
    return this.tasksService.findAll(
      user,
      {
        search,
        projectId,
        status,
        priority,
      }
    );
  }

  @Post()
  create(
    @Body() body: any,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.tasksService.create(
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
    return this.tasksService.findOne(
      id,
      user
    );
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body() body: any,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.tasksService.update(
      id,
      body,
      user
    );
  }

  @Delete(':id')
  delete(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.tasksService.delete(
      id,
      user
    );
  }
}