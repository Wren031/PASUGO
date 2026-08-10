import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review-service';
import type { ReviewSubmission } from '@/types/review';

export function useDriverReviews(driverId: string | undefined) {
  return useQuery({
    queryKey: ['driver-reviews', driverId],
    queryFn: () => reviewService.getReviewsForTarget(driverId as string),
    enabled: Boolean(driverId),
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submission: ReviewSubmission) => reviewService.submitReview(submission),
    onSuccess: (_review, submission) => {
      queryClient.invalidateQueries({ queryKey: ['driver-reviews', submission.targetId] });
      queryClient.invalidateQueries({ queryKey: ['passenger-bookings'] });
    },
  });
}
