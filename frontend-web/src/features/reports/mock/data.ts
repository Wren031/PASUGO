import type { CancellationReason, PeakHour, PopularRoute, ReportSummary, ReportTimeframe, WeeklyTrend } from '../types';

export const summaries: Record<ReportTimeframe, ReportSummary> = {
  daily: {
    bookings: 324,
    revenue: 284_500,
    activeDrivers: 412,
    newPassengers: 86,
    cancellations: 18,
    avgRideDuration: 14,
    avgRating: 4.82,
    completedTrips: 296,
    distanceKm: 3_420,
  },
  weekly: {
    bookings: 2_148,
    revenue: 1_892_400,
    activeDrivers: 538,
    newPassengers: 512,
    cancellations: 128,
    avgRideDuration: 15,
    avgRating: 4.79,
    completedTrips: 1_930,
    distanceKm: 24_150,
  },
  monthly: {
    bookings: 9_876,
    revenue: 8_764_200,
    activeDrivers: 612,
    newPassengers: 2_405,
    cancellations: 576,
    avgRideDuration: 16,
    avgRating: 4.81,
    completedTrips: 8_742,
    distanceKm: 108_400,
  },
};

export const weeklyTrend: WeeklyTrend[] = [
  { week: 'W1', bookings: 1_480, revenue: 1_248_000 },
  { week: 'W2', bookings: 1_660, revenue: 1_402_500 },
  { week: 'W3', bookings: 1_540, revenue: 1_361_800 },
  { week: 'W4', bookings: 1_780, revenue: 1_548_200 },
  { week: 'W5', bookings: 1_920, revenue: 1_704_600 },
  { week: 'W6', bookings: 2_060, revenue: 1_855_300 },
  { week: 'W7', bookings: 2_148, revenue: 1_892_400 },
];

export const popularRoutes: PopularRoute[] = [
  { route: 'BGC ↔ Makati CBD', trips: 1_942, revenue: 1_681_400, distanceKm: 9 },
  { route: 'Ortigas ↔ Makati CBD', trips: 1_587, revenue: 1_396_560, distanceKm: 12 },
  { route: 'Cubao ↔ Ortigas', trips: 1_324, revenue: 1_043_000, distanceKm: 7 },
  { route: 'SM Mall of Asia ↔ Makati CBD', trips: 1_108, revenue: 974_800, distanceKm: 13 },
  { route: 'Quezon City Memorial Circle ↔ Cubao', trips: 986, revenue: 762_400, distanceKm: 6 },
  { route: 'Binondo ↔ Quezon Ave', trips: 872, revenue: 689_300, distanceKm: 9 },
];

export const peakHours: PeakHour[] = [
  { hour: '7 AM', bookings: 108, revenue: 94_600 },
  { hour: '8 AM', bookings: 142, revenue: 124_900 },
  { hour: '9 AM', bookings: 98, revenue: 86_300 },
  { hour: '10 AM', bookings: 64, revenue: 55_800 },
  { hour: '11 AM', bookings: 58, revenue: 50_400 },
  { hour: '12 PM', bookings: 76, revenue: 66_200 },
  { hour: '1 PM', bookings: 62, revenue: 54_100 },
  { hour: '2 PM', bookings: 66, revenue: 57_600 },
  { hour: '3 PM', bookings: 72, revenue: 63_000 },
  { hour: '4 PM', bookings: 88, revenue: 77_200 },
  { hour: '5 PM', bookings: 134, revenue: 118_900 },
  { hour: '6 PM', bookings: 156, revenue: 138_700 },
  { hour: '7 PM', bookings: 128, revenue: 112_500 },
  { hour: '8 PM', bookings: 92, revenue: 80_800 },
  { hour: '9 PM', bookings: 71, revenue: 62_500 },
];

export const cancellationReasons: CancellationReason[] = [
  { reason: 'Driver took too long to arrive', count: 214, percentage: 37 },
  { reason: 'Passenger changed plans', count: 168, percentage: 29 },
  { reason: 'Driver canceled the booking', count: 96, percentage: 17 },
  { reason: 'Wrong pickup location', count: 52, percentage: 9 },
  { reason: 'Price too high', count: 46, percentage: 8 },
];
