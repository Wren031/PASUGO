import { useMutation, useQueryClient } from '@tanstack/react-query';
import { passengerService } from '../../profile/services/profile-service';
import type { PassengerProfilePatch } from '@/types/passenger';

export function useVerifyAccount(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: PassengerProfilePatch) =>
      passengerService.verifyAccount(userId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passenger', userId] });
    },
  });
}
