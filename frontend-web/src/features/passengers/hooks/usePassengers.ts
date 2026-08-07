import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { passengerService } from '../services/passengerService';

export function usePassengers() {
  return useQuery({ queryKey: ['passengers'], queryFn: passengerService.getPassengers });
}

export function usePassenger(id: string) {
  return useQuery({ queryKey: ['passengers', id], queryFn: () => passengerService.getPassengerById(id) });
}

export function usePassengerStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'suspend' | 'activate' }) =>
      action === 'suspend' ? passengerService.suspendPassenger(id) : passengerService.activatePassenger(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passengers'] });
    },
  });
}
