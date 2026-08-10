export type Role = 'passenger' | 'driver';

export type AccountStatus = 'Active' | 'Suspended' | 'Pending' | 'Inactive';

export type AvailabilityStatus = 'Available' | 'On Trip' | 'Offline';

export type BookingStatus =
  | 'Pending'
  | 'Searching Driver'
  | 'Accepted'
  | 'Driver Arrived'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type DocumentStatus = 'Approved' | 'Pending' | 'Rejected';

export interface DocumentInfo {
  status: DocumentStatus;
  note?: string;
}

export interface RatingSummary {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface TimelineEvent {
  id: string;
  label: string;
  description?: string;
  timestamp: string;
  status: 'done' | 'current' | 'pending';
}
