import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async findAll(
    user: JwtPayload,
    query: {
      role?: string;
    }
  ) {
    return this.prisma.user.findMany(
      {
        where: {
          orgId:
            user.orgId,

          deletedAt:
            null,

          ...(query.role &&
          query.role !==
            'ALL'
            ? {
                role:
                  query.role as any,
              }
            : {}),
        },

        select: {
          id: true,

          firstName:
            true,

          lastName:
            true,

          email:
            true,

          role:
            true,

          isActive:
            true,

          avatarUrl:
            true,

          createdAt:
            true,
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
    const existing =
      await this.prisma.user.findUnique(
        {
          where: {
            email:
              body.email,
          },
        }
      );

    if (existing) {
      throw new Error(
        'User already exists with this email'
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        body.password ??
          'Password@123',
        10
      );

    return this.prisma.user.create(
      {
        data: {
          orgId:
            user.orgId,

          firstName:
            body.firstName,

          lastName:
            body.lastName,

          email:
            body.email,

          passwordHash:
            hashedPassword,

          role:
            body.role ??
            'MEMBER',

          isActive:
            body.isActive ??
            true,
        },

        select: {
          id: true,

          firstName:
            true,

          lastName:
            true,

          email:
            true,

          role:
            true,

          isActive:
            true,

          avatarUrl:
            true,

          createdAt:
            true,
        },
      }
    );
  }

  async findOne(
    id: string,
    user: JwtPayload
  ) {
    const found =
      await this.prisma.user.findFirst(
        {
          where: {
            id,

            orgId:
              user.orgId,

            deletedAt:
              null,
          },

          select: {
            id: true,

            firstName:
              true,

            lastName:
              true,

            email:
              true,

            role:
              true,

            isActive:
              true,

            avatarUrl:
              true,

            createdAt:
              true,
          },
        }
      );

    if (!found) {
      throw new NotFoundException(
        'User not found'
      );
    }

    return found;
  }

  async update(
    id: string,
    body: any,
    user: JwtPayload
  ) {
    const existing =
      await this.prisma.user.findFirst(
        {
          where: {
            id,

            orgId:
              user.orgId,

            deletedAt:
              null,
          },
        }
      );

    if (!existing) {
      throw new NotFoundException(
        'User not found'
      );
    }

    return this.prisma.user.update(
      {
        where: {
          id,
        },

        data: {
          firstName:
            body.firstName,

          lastName:
            body.lastName,

          email:
            body.email,

          role:
            body.role,

          isActive:
            body.isActive,
        },

        select: {
          id: true,

          firstName:
            true,

          lastName:
            true,

          email:
            true,

          role:
            true,

          isActive:
            true,

          avatarUrl:
            true,

          createdAt:
            true,
        },
      }
    );
  }

  async delete(
    id: string,
    user: JwtPayload
  ) {
    const existing =
      await this.prisma.user.findFirst(
        {
          where: {
            id,

            orgId:
              user.orgId,

            deletedAt:
              null,
          },
        }
      );

    if (!existing) {
      throw new NotFoundException(
        'User not found'
      );
    }

    await this.prisma.user.update(
      {
        where: {
          id,
        },

        data: {
          deletedAt:
            new Date(),
        },
      }
    );

    return {
      success: true,
    };
  }
}