import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { passengerService } from '../services/profile-service';
import { useAuthStore } from '@/store/auth-store';

export function usePassengerProfile(userId: string) {
  return useQuery({
    queryKey: ['passenger', userId],
    queryFn: () => passengerService.getProfile(userId),
    enabled: Boolean(userId),
  });
}

export function useUpdatePassengerProfile(userId: string) {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);
  return useMutation({
    mutationFn: (patch: Parameters<typeof passengerService.updateProfile>[1]) =>
      passengerService.updateProfile(userId, patch),
    onSuccess: (passenger) => {
      updateUser({ name: passenger.name, email: passenger.email });
      queryClient.invalidateQueries({ queryKey: ['passenger', userId] });
    },
  });
}
