import { mockAlerts, AlertDetail, AlertCategory, AlertSeverity } from '../mocks/alertMockData';

// Clone in-memory database locally to allow mutation (marking read / archiving)
let alertsRegistry = [...mockAlerts];

export interface GetAlertsFilters {
  search?: string;
  category?: AlertCategory | 'ALL';
  severity?: AlertSeverity | 'ALL';
  readStatus?: 'ALL' | 'UNREAD' | 'READ';
  archivedStatus?: 'ALL' | 'ACTIVE' | 'ARCHIVED';
  page?: number;
  limit?: number;
}

export interface GetAlertsResponse {
  data: AlertDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const AlertService = {
  /**
   * Fetches paginated, filtered, and searched notifications
   */
  getAlerts: async (filters: GetAlertsFilters = {}): Promise<GetAlertsResponse> => {
    const {
      search = '',
      category = 'ALL',
      severity = 'ALL',
      readStatus = 'ALL',
      archivedStatus = 'ACTIVE', // Default to active alerts only
      page = 1,
      limit = 10,
    } = filters;

    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulating regional latency

    let filtered = [...alertsRegistry];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.message.toLowerCase().includes(q) ||
          a.projectName?.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category !== 'ALL') {
      filtered = filtered.filter((a) => a.category === category);
    }

    // Severity filter
    if (severity !== 'ALL') {
      filtered = filtered.filter((a) => a.severity === severity);
    }

    // Read status filter
    if (readStatus === 'UNREAD') {
      filtered = filtered.filter((a) => !a.read);
    } else if (readStatus === 'READ') {
      filtered = filtered.filter((a) => a.read);
    }

    // Archived status filter
    if (archivedStatus === 'ACTIVE') {
      filtered = filtered.filter((a) => !a.archived);
    } else if (archivedStatus === 'ARCHIVED') {
      filtered = filtered.filter((a) => a.archived);
    }

    // Sort by createdAt descending (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIdx = (page - 1) * limit;
    const data = filtered.slice(startIdx, startIdx + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  },

  /**
   * Marks a single alert as read
   */
  markAsRead: async (id: string): Promise<AlertDetail | null> => {
    alertsRegistry = alertsRegistry.map((a) =>
      a.id === id ? { ...a, read: true } : a
    );
    const found = alertsRegistry.find((a) => a.id === id);
    return found ?? null;
  },

  /**
   * Archives a single alert
   */
  archiveAlert: async (id: string): Promise<AlertDetail | null> => {
    alertsRegistry = alertsRegistry.map((a) =>
      a.id === id ? { ...a, archived: true } : a
    );
    const found = alertsRegistry.find((a) => a.id === id);
    return found ?? null;
  },

  /**
   * Gets unread notifications count
   */
  getUnreadCount: async (): Promise<number> => {
    return alertsRegistry.filter((a) => !a.read && !a.archived).length;
  }
};
