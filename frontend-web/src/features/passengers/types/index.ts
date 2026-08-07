import type { AccountStatus } from '@/types/common';

export interface PassengerBooking {
  id: string;
  date: string;
  route: string;
  fare: number;
  status: string;
}

export interface Passenger {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  totalBookings: number;
  totalSpent: number;
  rating: number;
  status: AccountStatus;
  identityVerified: boolean;
  preferredPayment: 'Cash' | 'GCash' | 'Card' | 'Wallet';
  homeLocation: string;
  workLocation: string;
  bookingHistory: PassengerBooking[];
}
