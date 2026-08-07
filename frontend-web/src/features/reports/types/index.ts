export type ReportTimeframe = 'daily' | 'weekly' | 'monthly';

export interface ReportSummary {
  bookings: number;
  revenue: number;
  activeDrivers: number;
  newPassengers: number;
  cancellations: number;
  avgRideDuration: number;
  avgRating: number;
  completedTrips: number;
  distanceKm: number;
}

export interface PopularRoute {
  route: string;
  trips: number;
  revenue: number;
  distanceKm: number;
}

export interface PeakHour {
  hour: string;
  bookings: number;
  revenue: number;
}

export interface CancellationReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface WeeklyTrend {
  week: string;
  bookings: number;
  revenue: number;
}

export interface ReportDataset {
  timeframe: ReportTimeframe;
  summary: ReportSummary;
  bookingTrend: WeeklyTrend[];
  popularRoutes: PopularRoute[];
  peakHours: PeakHour[];
  cancellationReasons: CancellationReason[];
}
