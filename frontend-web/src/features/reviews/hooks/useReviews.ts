import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import type { Review } from '../types';

export function useReviewSummary() {
  return useQuery({ queryKey: ['reviews', 'summary'], queryFn: reviewService.getSummary });
}

export function useReviews() {
  return useQuery({ queryKey: ['reviews'], queryFn: reviewService.getReviews });
}

export function useLowRatedDrivers() {
  return useQuery({ queryKey: ['reviews', 'low-rated'], queryFn: reviewService.getLowRatedDrivers });
}

export function useModerateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Review['status'] }) => reviewService.moderateReview(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
