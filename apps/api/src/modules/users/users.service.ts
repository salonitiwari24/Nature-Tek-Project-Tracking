import {
  BadRequestException,
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
      throw new BadRequestException(
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

    const data: any = {};

    if (body.firstName !== undefined) data.firstName = body.firstName;
    if (body.lastName !== undefined) data.lastName = body.lastName;
    if (body.email !== undefined) data.email = body.email;
    if (body.role !== undefined) data.role = body.role;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    return this.prisma.user.update(
      {
        where: {
          id,
        },

        data,

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

  async resetPassword(
    id: string,
    body: { password?: string },
    user: JwtPayload
  ) {
    const existing =
      await this.prisma.user.findFirst(
        {
          where: {
            id,
            orgId: user.orgId,
            deletedAt: null,
          },
        }
      );

    if (!existing) {
      throw new NotFoundException(
        'User not found'
      );
    }

    const password =
      body.password ??
      'Password@123';

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    await this.prisma.user.update(
      {
        where: {
          id,
        },

        data: {
          passwordHash,
        },
      }
    );

    return {
      success: true,
      temporaryPassword:
        body.password
          ? undefined
          : password,
    };
  }
}
