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

import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  RolesGuard
)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  findAll(
    @CurrentUser()
    user: JwtPayload,

    @Query('role')
    role?: string
  ) {
    return this.usersService.findAll(
      user,
      {
        role,
      }
    );
  }

  @Post()
  create(
    @Body()
    body: any,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.usersService.create(
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
    return this.usersService.findOne(
      id,
      user
    );
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    body: any,

    @CurrentUser()
    user: JwtPayload
  ) {
    return this.usersService.update(
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
    return this.usersService.delete(
      id,
      user
    );
  }
}