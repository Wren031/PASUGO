export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export type Trend = 'up' | 'down' | 'flat';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

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

export interface DocumentStatus {
  status: 'Approved' | 'Pending' | 'Rejected' | 'Resubmission';
  note?: string;
}

export interface TimelineEvent {
  id: string;
  label: string;
  description?: string;
  timestamp: string;
  status: 'done' | 'current' | 'pending' | 'failed';
}

export interface RatingSummary {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
