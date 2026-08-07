import { useQuery } from '@tanstack/react-query';
import { earningService } from '../services/earningService';

export function useEarnings() {
  return useQuery({ queryKey: ['earnings', 'revenue'], queryFn: () => Promise.all([earningService.getDailyRevenue(), earningService.getWeeklyRevenue(), earningService.getMonthlyRevenue()]) });
}

export function useDriverEarnings() {
  return useQuery({ queryKey: ['earnings', 'drivers'], queryFn: earningService.getDriverEarnings });
}

export function useCommissionSplit() {
  return useQuery({ queryKey: ['earnings', 'commission'], queryFn: earningService.getCommissionSplit });
}
