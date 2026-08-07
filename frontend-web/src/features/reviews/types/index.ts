export type ReviewType = 'Passenger' | 'Driver';
export type ReviewStatus = 'Visible' | 'Flagged' | 'Removed';

export interface Review {
  id: string;
  type: ReviewType;
  authorName: string;
  targetName: string;
  rating: number;
  comment: string;
  bookingId: string;
  date: string;
  status: ReviewStatus;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  passengerReviews: number;
  driverReviews: number;
  flaggedReviews: number;
}

export interface LowRatedDriver {
  id: string;
  name: string;
  rating: number;
  recentRating: number;
  flaggedCount: number;
  lastTrip: string;
}
