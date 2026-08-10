import type { Passenger } from '@/types/passenger';

export interface PassengerDashboard {
  passenger: Passenger;
  activeBookingId: string | null;
}

export type { Passenger };
