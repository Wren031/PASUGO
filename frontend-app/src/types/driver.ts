import type { AccountStatus, AvailabilityStatus, DocumentInfo, RatingSummary } from './common';
import type { LatLng } from './map';

export interface DriverMotorcycle {
  brand: string;
  model: string;
  plateNumber: string;
  color: string;
  year: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  photoUrl?: string;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  totalDistanceKm: number;
  availability: AvailabilityStatus;
  status: AccountStatus;
  joinedAt: string;
  yearsExperience: number;
  motorcycle: DriverMotorcycle;
  ratingSummary: RatingSummary;
  documents: {
    license: DocumentInfo;
    orcr: DocumentInfo;
    nbi: DocumentInfo;
  };
  currentLocation: LatLng;
}

export interface DriverEarningBreakdown {
  grossEarnings: number;
  commission: number;
  netEarnings: number;
  bonuses: number;
  trips: number;
  distanceKm: number;
  rating: number;
}

export interface DriverTripEarning {
  id: string;
  bookingId: string;
  date: string;
  passengerName: string;
  distanceKm: number;
  fare: number;
  commission: number;
  net: number;
  bonus: number;
  rating: number;
  paymentMethod: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface EarningsReport {
  today: DriverEarningBreakdown;
  week: DriverEarningBreakdown;
  month: DriverEarningBreakdown;
  weeklyChart: ChartPoint[];
  monthlyChart: ChartPoint[];
  recentTrips: DriverTripEarning[];
}
