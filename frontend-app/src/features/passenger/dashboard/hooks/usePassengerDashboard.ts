import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard-service';

export function usePassengerProfile(userId: string) {
  return useQuery({
    queryKey: ['passenger', userId],
    queryFn: () => dashboardService.getPassenger(userId),
    enabled: Boolean(userId),
  });
}
