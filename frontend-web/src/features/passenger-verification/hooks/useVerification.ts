import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { verificationService } from '../services/verificationService';

export function useApplications() {
  return useQuery({ queryKey: ['passenger-verification'], queryFn: verificationService.getApplications });
}

export function useApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, note }: { id: string; action: 'approve' | 'reject' | 'resubmit'; note?: string }) => {
      if (action === 'approve') return verificationService.approveApplication(id);
      if (action === 'reject') return verificationService.rejectApplication(id, note ?? 'Application rejected.');
      return verificationService.requestResubmission(id, note ?? 'Please resubmit the required documents.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passenger-verification'] });
      queryClient.invalidateQueries({ queryKey: ['passengers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
}
