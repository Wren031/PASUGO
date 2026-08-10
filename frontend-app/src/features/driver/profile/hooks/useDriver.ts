import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../services/driver-service';
import type { DriverTripEarning } from '@/types/driver';

export function useDriverProfile(driverId: string) {
  return useQuery({
    queryKey: ['driver', driverId],
    queryFn: () => driverService.getProfile(driverId),
    enabled: Boolean(driverId),
  });
}

export function useUpdateDriverProfile(driverId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Parameters<typeof driverService.updateProfile>[1]) => driverService.updateProfile(driverId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver', driverId] });
    },
  });
}

export function useDriverEarnings(driverId: string) {
  return useQuery({
    queryKey: ['driver-earnings', driverId],
    queryFn: () => driverService.getEarnings(driverId),
    enabled: Boolean(driverId),
    refetchInterval: 60_000,
  });
}

export function useDriverTrips(driverId: string) {
  return useQuery({
    queryKey: ['driver-trips', driverId],
    queryFn: () => driverService.getTrips(driverId),
    enabled: Boolean(driverId),
  });
}

export function useAddTripEarning(driverId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (record: Omit<DriverTripEarning, 'id'> & { driverId: string; pickup?: string; dropoff?: string }) =>
      driverService.addTripEarning(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-earnings', driverId] });
      queryClient.invalidateQueries({ queryKey: ['driver-trips', driverId] });
    },
  });
}

export function useDriverRideRequests(driverId: string) {
  return useQuery({
    queryKey: ['driver-requests', driverId],
    queryFn: () => driverService.getRideRequests(driverId),
    enabled: Boolean(driverId),
    refetchInterval: 20_000,
  });
}
