import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { complaintService } from '../services/complaintService';

export function useComplaintStats() {
  return useQuery({ queryKey: ['complaints', 'stats'], queryFn: complaintService.getStats });
}

export function useComplaints() {
  return useQuery({ queryKey: ['complaints'], queryFn: complaintService.getComplaints });
}

export function useSupportTickets() {
  return useQuery({ queryKey: ['complaints', 'tickets'], queryFn: complaintService.getSupportTickets });
}

export function useResolveComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) => complaintService.resolve(id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
}
