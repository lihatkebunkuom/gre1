import { apiClient } from './api-client';

export interface DashboardStats {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface AttendanceTrend {
  categories: string[];
  data: number[];
}

export interface FinanceTrend {
  categories: string[];
  income: number[];
  expense: number[];
}

export interface UpcomingService {
  name: string;
  time: string;
  theme: string;
  speaker: string;
}

export interface RecentActivity {
  user: string;
  action: string;
  time: string;
}

export interface DashboardData {
  stats: DashboardStats[];
  attendanceTrend: AttendanceTrend;
  financeTrend: FinanceTrend;
  upcomingServices: UpcomingService[];
  recentActivities: RecentActivity[];
}

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    return apiClient.get('/dashboard');
  },
};
