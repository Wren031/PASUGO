import { mockDelay } from '@/utils/mock';
import type { CommissionSplit, DriverEarning, RevenuePeriod } from '../types';
import { commissionSplit, dailyRevenue, driverEarnings, monthlyRevenue, weeklyRevenue } from '../mock/data';

export const earningService = {
  async getDailyRevenue(): Promise<RevenuePeriod[]> {
    await mockDelay(300);
    return dailyRevenue.map((item) => ({ ...item }));
  },
  async getWeeklyRevenue(): Promise<RevenuePeriod[]> {
    await mockDelay(300);
    return weeklyRevenue.map((item) => ({ ...item }));
  },
  async getMonthlyRevenue(): Promise<RevenuePeriod[]> {
    await mockDelay(300);
    return monthlyRevenue.map((item) => ({ ...item }));
  },
  async getDriverEarnings(): Promise<DriverEarning[]> {
    await mockDelay(300);
    return driverEarnings.map((item) => ({ ...item }));
  },
  async getCommissionSplit(): Promise<CommissionSplit> {
    await mockDelay(300);
    return { ...commissionSplit };
  },
};
