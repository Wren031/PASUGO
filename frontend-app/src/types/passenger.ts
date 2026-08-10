import type { AccountStatus } from './common';
import type { PaymentMethod } from './booking';
import type { LatLng } from './map';

export interface SavedPlace {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  address: string;
  coordinates: LatLng;
}

export interface Passenger {
  id: string;
  name: string;
  phone: string;
  email: string;
  photoUrl?: string;
  rating: number;
  totalBookings: number;
  totalSpent: number;
  status: AccountStatus;
  identityVerified: boolean;
  preferredPayment: PaymentMethod;
  homeLocation: string;
  workLocation: string;
  savedPlaces: SavedPlace[];
}
