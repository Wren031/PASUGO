import { useQuery } from '@tanstack/react-query';
import { liveTripService } from '../services/liveTripService';

export function useTripStats() {
  return useQuery({ queryKey: ['live-trips', 'stats'], queryFn: liveTripService.getTripStats, refetchInterval: 10_000 });
}

export function useLiveTrips() {
  return useQuery({ queryKey: ['live-trips'], queryFn: liveTripService.getLiveTrips, refetchInterval: 10_000 });
}
