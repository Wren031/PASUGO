import type { BookingStatus, TimelineEvent } from './common';
import type { LatLng } from './map';

export type PaymentMethod = 'Cash' | 'GCash' | 'Card' | 'Wallet';

export type TripPhase =
  | 'searching'
  | 'accepted'
  | 'arriving'
  | 'picked-up'
  | 'in-trip'
  | 'completed'
  | 'cancelled';

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
  pickupCoordinates: LatLng;
  dropoff: string;
  dropoffCoordinates: LatLng;
  distanceKm: number;
  durationMin: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  bookedAt: string;
  fare: FareBreakdown;
  timeline: TimelineEvent[];
  rated: boolean;
  ratingValue?: number;
}

export interface BookingDraft {
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  pickup: string;
  pickupCoordinates: LatLng;
  dropoff: string;
  dropoffCoordinates: LatLng;
  distanceKm: number;
  durationMin: number;
  paymentMethod: PaymentMethod;
  fare: FareBreakdown;
}

export interface AvailableDriver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  distanceKm: number;
  etaMin: number;
  coordinates: LatLng;
  motorcycle: string;
  plateNumber: string;
}

export interface RideRequest {
  id: string;
  bookingId: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  passengerRating: number;
  passengerTrips: number;
  pickup: string;
  pickupCoordinates: LatLng;
  dropoff: string;
  dropoffCoordinates: LatLng;
  distanceKm: number;
  durationMin: number;
  estimatedFare: number;
  paymentMethod: PaymentMethod;
  requestedAt: string;
  expiresAt: string;
}
