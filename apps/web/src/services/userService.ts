import { mockUsers, UserDetail, UserRole } from '../mocks/userMockData';

let localUsers: UserDetail[] = [...mockUsers];

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

export class UserService {
  private static LATENCY = 80;

  private static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getUsers(filters: GetUsersFilters = {}): Promise<PaginatedUsers> {
    await this.delay(this.LATENCY);

    const { search = '', role = 'ALL', status = 'ALL', page = 1, limit = 10 } = filters;

    let filtered = [...localUsers];

    // Apply Search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
      );
    }

    // Apply Role
    if (role && role !== 'ALL') {
      filtered = filtered.filter((u) => u.role === role);
    }

    // Apply Status
    if (status && status !== 'ALL') {
      filtered = filtered.filter((u) => u.status === status);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filtered.slice(startIndex, endIndex);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  }

  static async getUserById(id: string): Promise<UserDetail | null> {
    await this.delay(this.LATENCY);
    const found = localUsers.find((u) => u.id === id);
    return found ? { ...found } : null;
  }

  static async createUser(data: Omit<UserDetail, 'id' | 'lastActivity' | 'performance'>): Promise<UserDetail> {
    await this.delay(this.LATENCY);

    const id = `u-${localUsers.length + 101}`;
    const newUser: UserDetail = {
      ...data,
      id,
      lastActivity: new Date().toISOString().replace('T', ' ').substring(0, 19),
      performance: {
        assignedTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
      },
    };

    localUsers.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, updates: Partial<UserDetail>): Promise<UserDetail | null> {
    await this.delay(this.LATENCY);
    const index = localUsers.findIndex((u) => u.id === id);
    if (index < 0) return null;

    const current = localUsers[index];
    const updated: UserDetail = {
      ...current,
      ...updates,
      id: current.id,
    };

    localUsers[index] = updated;
    return updated;
  }

  static async deleteUser(id: string): Promise<boolean> {
    await this.delay(this.LATENCY);
    const before = localUsers.length;
    localUsers = localUsers.filter((u) => u.id !== id);
    return localUsers.length < before;
  }
}
