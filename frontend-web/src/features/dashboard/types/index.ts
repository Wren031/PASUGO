export interface DashboardStats {
  totalPassengers: number;
  totalDrivers: number;
  totalBookings: number;
  activeTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  totalRevenue: number;
  todayRevenue: number;
  pendingDriverApplications: number;
}

export interface RecentActivity {
  id: string;
  type: 'booking' | 'driver' | 'payment' | 'passenger' | 'system' | 'complaint';
  title: string;
  description: string;
  timestamp: string;
}

export interface LiveDriverStatus {
  id: string;
  name: string;
  status: 'Online' | 'On Trip' | 'Offline';
  rating: number;
  tripsToday: number;
  earningsToday: number;
}

export interface TopDriver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  earnings: number;
}

export interface LatestBooking {
  id: string;
  passengerName: string;
  driverName?: string;
  route: string;
  status: string;
  fare: number;
  time: string;
}
