import { mockDelay } from '@/utils/mock';
import type {
  DashboardStats,
  LatestBooking,
  LiveDriverStatus,
  RecentActivity,
  TopDriver,
} from '../types';
import {
  bookingAnalytics,
  dashboardStats,
  latestBookings,
  liveDrivers,
  recentActivities,
  revenueTrend,
  topDrivers,
} from '../mock/data';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    await mockDelay(350);
    return { ...dashboardStats };
  },
  async getBookingAnalytics() {
    await mockDelay(350);
    return [...bookingAnalytics];
  },
  async getRevenueTrend() {
    await mockDelay(350);
    return [...revenueTrend];
  },
  async getRecentActivities(): Promise<RecentActivity[]> {
    await mockDelay(350);
    return [...recentActivities];
  },
  async getLiveDrivers(): Promise<LiveDriverStatus[]> {
    await mockDelay(350);
    return [...liveDrivers];
  },
  async getTopDrivers(): Promise<TopDriver[]> {
    await mockDelay(350);
    return [...topDrivers];
  },
  async getLatestBookings(): Promise<LatestBooking[]> {
    await mockDelay(350);
    return [...latestBookings];
  },
};
