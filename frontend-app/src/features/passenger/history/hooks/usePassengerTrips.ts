import { useQuery } from '@tanstack/react-query';
import { historyService } from '../services/history-service';

export function usePassengerTrips(passengerId: string) {
  return useQuery({
    queryKey: ['passenger-bookings', passengerId],
    queryFn: () => historyService.getBookings(passengerId),
    enabled: Boolean(passengerId),
  });
}
