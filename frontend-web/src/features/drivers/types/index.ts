import type { AccountStatus, AvailabilityStatus, DocumentStatus, RatingSummary } from '@/types/common';

export interface DriverTrip {
  id: string;
  date: string;
  passengerName: string;
  route: string;
  fare: number;
  status: string;
  rating?: number;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  availability: AvailabilityStatus;
  status: AccountStatus;
  motorcycle: string;
  plateNumber: string;
  yearsExperience: number;
  ratingSummary: RatingSummary;
  documents: {
    license: DocumentStatus;
    orcr: DocumentStatus;
    nbi: DocumentStatus;
  };
  weeklyPerformance: { label: string; trips: number; earnings: number }[];
  tripHistory: DriverTrip[];
}
