import { api } from '@/services';
import type { Review, ReviewSubmission } from '@/types/review';
import type { Booking } from '@/types/booking';

export const reviewService = {
  async getReviewsForTarget(targetId: string): Promise<Review[]> {
    return api.getReviewsForTarget(targetId);
  },

  async submitReview(submission: ReviewSubmission): Promise<Review> {
    const review = await api.submitReview(submission);
    if (submission.bookingId) {
      await api.markBookingRated(submission.bookingId, submission.rating);
    }
    return review;
  },

  async markBookingRated(id: string, rating: number): Promise<Booking> {
    return api.markBookingRated(id, rating);
  },
};
