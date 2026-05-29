import { useState, useEffect, useCallback } from 'react';
import { DashboardService, DashboardStats } from '../services/dashboardService';
import { Project, MonthlyCompletion, DashboardAlert } from '../mocks/dashboardMockData';

export interface DashboardDataState {
  stats: DashboardStats | null;
  recentProjects: Project[];
  monthlyCompletions: MonthlyCompletion[];
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  alerts: DashboardAlert[];
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData(projectType: string = 'ALL') {
  const [state, setState] = useState<DashboardDataState>({
    stats: null,
    recentProjects: [],
    monthlyCompletions: [],
    statusDistribution: [],
    alerts: [],
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [
        statsData,
        recentProjectsData,
        monthlyCompletionsData,
        statusDistributionData,
        alertsData,
      ] = await Promise.all([
        DashboardService.getStats(projectType),
        DashboardService.getRecentProjects(projectType),
        DashboardService.getMonthlyCompletions(),
        DashboardService.getStatusDistribution(projectType),
        DashboardService.getAlerts(projectType),
      ]);

      setState({
        stats: statsData,
        recentProjects: recentProjectsData,
        monthlyCompletions: monthlyCompletionsData,
        statusDistribution: statusDistributionData,
        alerts: alertsData,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch dashboard data',
      }));
    }
  }, [projectType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}
