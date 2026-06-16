import { api } from '../lib/api';

export type UserRole =
  | 'ADMIN'
  | 'PM'
  | 'SUPERVISOR'
  | 'MEMBER'
  | 'EXEC'
  | 'DESIGN'
  | 'PROCUREMENT'
  | 'QA'
  | 'FINANCE'
  | 'CLIENT'
  | 'SERVICE';

export interface UserDetail {
  id: string;

  firstName: string;
  lastName: string;

  email: string;

  role: UserRole;

  isActive: boolean;

  avatarUrl?: string | null;

  createdAt?: string;
}

export interface GetUsersFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedUsers {
  data: UserDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
}

export class UserService {
  static async getUsers(
    filters: GetUsersFilters = {}
  ): Promise<PaginatedUsers> {
    const params =
      new URLSearchParams();

    if (
      filters.role &&
      filters.role !==
        'ALL'
    ) {
      params.append(
        'role',
        filters.role
      );
    }

    const query =
      params.toString();

    const users =
      await api<any[]>(
        `/users${
          query
            ? `?${query}`
            : ''
        }`
      );

    let filtered =
      [...users];

    // search frontend-side
    if (
      filters.search?.trim()
    ) {
      const q =
        filters.search.toLowerCase();

      filtered =
        filtered.filter(
          (u) =>
            `${u.firstName} ${u.lastName}`
              .toLowerCase()
              .includes(q) ||
            u.email
              .toLowerCase()
              .includes(q)
        );
    }

    // active/inactive filter
    if (
      filters.status &&
      filters.status !==
        'ALL'
    ) {
      filtered =
        filtered.filter(
          (u) =>
            filters.status ===
            'ACTIVE'
              ? u.isActive
              : !u.isActive
        );
    }

    const mapped =
      filtered.map(
        (u) => ({
          id: u.id,

          firstName:
            u.firstName,

          lastName:
            u.lastName,

          email:
            u.email,

          role:
            u.role,

          isActive:
            u.isActive,

          avatarUrl:
            u.avatarUrl,

          createdAt:
            u.createdAt,
        })
      );

    return {
      data: mapped,
      total:
        mapped.length,
      page:
        filters.page ??
        1,
      limit:
        filters.limit ??
        10,
      totalPages: 1,
    };
  }

  static async getUserById(
    id: string
  ): Promise<UserDetail> {
    const user =
      await api<any>(
        `/users/${id}`
      );

    return {
      id: user.id,

      firstName:
        user.firstName,

      lastName:
        user.lastName,

      email:
        user.email,

      role:
        user.role,

      isActive:
        user.isActive,

      avatarUrl:
        user.avatarUrl,

      createdAt:
        user.createdAt,
    };
  }

  static async createUser(
    data: CreateUserInput
  ): Promise<UserDetail> {
    const user =
      await api<any>(
        '/users',
        {
          method: 'POST',
          body: JSON.stringify(
            {
              ...data,

              // temporary password
              password:
                'Password@123',
            }
          ),
        }
      );

    return {
      id: user.id,

      firstName:
        user.firstName,

      lastName:
        user.lastName,

      email:
        user.email,

      role:
        user.role,

      isActive:
        user.isActive,

      avatarUrl:
        user.avatarUrl,

      createdAt:
        user.createdAt,
    };
  }

  static async updateUser(
    id: string,
    updates: Partial<CreateUserInput>
  ): Promise<UserDetail> {
    const user =
      await api<any>(
        `/users/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(
            updates
          ),
        }
      );

    return {
      id: user.id,

      firstName:
        user.firstName,

      lastName:
        user.lastName,

      email:
        user.email,

      role:
        user.role,

      isActive:
        user.isActive,

      avatarUrl:
        user.avatarUrl,

      createdAt:
        user.createdAt,
    };
  }

  static async deleteUser(
    id: string
  ): Promise<void> {
    await api(
      `/users/${id}`,
      {
        method:
          'DELETE',
      }
    );
  }
}