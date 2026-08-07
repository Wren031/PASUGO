import type { BookingStatus, TimelineEvent } from '@/types/common';

export type PaymentMethod = 'Cash' | 'GCash' | 'Card' | 'Wallet';

export interface FareBreakdown {
  baseFare: number;
  distanceCharge: number;
  timeCharge: number;
  bookingFee: number;
  discount: number;
  surgeMultiplier: number;
  total: number;
}

export interface Booking {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  driverId?: string;
  driverName?: string;
  driverRating?: number;
  pickup: string;
  dropoff: string;
  distanceKm: number;
  durationMin: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  bookedAt: string;
  fare: FareBreakdown;
  timeline: TimelineEvent[];
}

export interface AvailableDriver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  distanceKm: number;
  etaMin: number;
}
