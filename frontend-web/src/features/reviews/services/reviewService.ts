import { mockDelay } from '@/utils/mock';
import type { LowRatedDriver, Review, ReviewSummary } from '../types';
import { lowRatedDrivers, reviews, reviewSummary } from '../mock/data';

export const reviewService = {
  async getSummary(): Promise<ReviewSummary> {
    await mockDelay(300);
    return { ...reviewSummary };
  },
  async getReviews(): Promise<Review[]> {
    await mockDelay(400);
    return reviews.map((item) => ({ ...item }));
  },
  async getLowRatedDrivers(): Promise<LowRatedDriver[]> {
    await mockDelay(300);
    return lowRatedDrivers.map((item) => ({ ...item }));
  },
  async moderateReview(id: string, status: Review['status']): Promise<void> {
    await mockDelay(300);
    const review = reviews.find((item) => item.id === id);
    if (review) {
      review.status = status;
    }
  },
};
