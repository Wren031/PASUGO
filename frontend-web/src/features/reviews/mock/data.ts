import type { LowRatedDriver, Review, ReviewSummary } from '../types';

export const reviewSummary: ReviewSummary = {
  averageRating: 4.8,
  totalReviews: 38420,
  passengerReviews: 21480,
  driverReviews: 16940,
  flaggedReviews: 87,
};

export const reviews: Review[] = [
  { id: 'r1', type: 'Passenger', authorName: 'Maria Santos', targetName: 'Arman Castillo', rating: 5, comment: 'Very courteous driver. Gave me his extra helmet and drove smoothly.', bookingId: 'B-20841', date: '2026-08-07T11:20:00', status: 'Visible' },
  { id: 'r2', type: 'Passenger', authorName: 'Paolo Mendoza', targetName: 'Dennis Aquino', rating: 5, comment: 'Fast and took the quickest route through BGC traffic.', bookingId: 'B-20840', date: '2026-08-07T11:18:00', status: 'Visible' },
  { id: 'r3', type: 'Driver', authorName: 'Dennis Aquino', targetName: 'Paolo Mendoza', rating: 5, comment: 'Polite passenger, ready at pickup on time.', bookingId: 'B-20840', date: '2026-08-07T11:17:00', status: 'Visible' },
  { id: 'r4', type: 'Passenger', authorName: 'Katrina Villanueva', targetName: 'Ronald Fernandez', rating: 4, comment: 'Good ride but arrived 3 minutes late due to heavy traffic.', bookingId: 'B-20839', date: '2026-08-07T11:08:00', status: 'Visible' },
  { id: 'r5', type: 'Passenger', authorName: 'Miguel Tan', targetName: 'Noel Antonio', rating: 5, comment: 'Very professional. Bike was clean and well maintained.', bookingId: 'B-20836', date: '2026-08-07T10:12:00', status: 'Visible' },
  { id: 'r6', type: 'Driver', authorName: 'Noel Antonio', targetName: 'Miguel Tan', rating: 5, comment: 'Quick to board and followed safety instructions.', bookingId: 'B-20836', date: '2026-08-07T10:11:00', status: 'Visible' },
  { id: 'r7', type: 'Passenger', authorName: 'Sofia Garcia', targetName: 'Victor Suarez', rating: 2, comment: 'Driver took a longer route than needed. Fare felt unfair.', bookingId: 'B-20835', date: '2026-08-07T08:52:00', status: 'Flagged' },
  { id: 'r8', type: 'Passenger', authorName: 'Gina Lopez', targetName: 'Mark Villanueva', rating: 3, comment: 'OK ride but driver was on his phone several times.', bookingId: 'B-20789', date: '2026-08-04T18:40:00', status: 'Flagged' },
  { id: 'r9', type: 'Driver', authorName: 'Marlon Cruz', targetName: 'Wendy Go', rating: 2, comment: 'Passenger changed destination mid-ride without telling me.', bookingId: 'B-20755', date: '2026-08-01T21:10:00', status: 'Visible' },
  { id: 'r10', type: 'Passenger', authorName: 'Hannah Reyes', targetName: 'Victor Suarez', rating: 5, comment: 'Best driver in San Juan! Very accommodating.', bookingId: 'B-20825', date: '2026-08-07T09:55:00', status: 'Visible' },
  { id: 'r11', type: 'Passenger', authorName: 'Wendy Go', targetName: 'Marlon Cruz', rating: 2, comment: 'Reckless driving near Marikina bridge. Uncomfortable.', bookingId: 'B-20755', date: '2026-08-01T21:15:00', status: 'Flagged' },
  { id: 'r12', type: 'Driver', authorName: 'Victor Suarez', targetName: 'Christian Ramos', rating: 5, comment: 'Great passenger, chatty but respectful.', bookingId: 'B-20828', date: '2026-08-07T07:55:00', status: 'Visible' },
];

export const lowRatedDrivers: LowRatedDriver[] = [
  { id: 'd9', name: 'Marlon Cruz', rating: 4.4, recentRating: 3.8, flaggedCount: 4, lastTrip: '2026-08-01T21:15:00' },
  { id: 'd5', name: 'Mark Villanueva', rating: 4.5, recentRating: 4.1, flaggedCount: 2, lastTrip: '2026-08-04T18:40:00' },
  { id: 'd3', name: 'Jomar Reyes', rating: 4.7, recentRating: 4.5, flaggedCount: 1, lastTrip: '2026-08-07T10:36:00' },
];
