import type { Role } from './common';

export interface Review {
  id: string;
  authorName: string;
  authorRole: Role;
  targetId: string;
  targetName: string;
  rating: number;
  comment: string;
  bookingId: string;
  date: string;
}

export interface ReviewSubmission {
  targetId: string;
  targetName: string;
  bookingId: string;
  rating: number;
  comment: string;
  authorName: string;
  authorRole: Role;
}
