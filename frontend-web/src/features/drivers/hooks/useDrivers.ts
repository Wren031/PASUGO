import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../services/driverService';

export function useDrivers() {
  return useQuery({ queryKey: ['drivers'], queryFn: driverService.getDrivers });
}

export function useDriver(id: string) {
  return useQuery({ queryKey: ['drivers', id], queryFn: () => driverService.getDriverById(id) });
}

export function useDriverStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'suspend' | 'activate' }) =>
      action === 'suspend' ? driverService.suspendDriver(id) : driverService.activateDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
}
