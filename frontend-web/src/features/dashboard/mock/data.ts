import type {
  DashboardStats,
  LatestBooking,
  LiveDriverStatus,
  RecentActivity,
  TopDriver,
} from '../types';

export const dashboardStats: DashboardStats = {
  totalPassengers: 48_320,
  totalDrivers: 3_214,
  totalBookings: 128_940,
  activeTrips: 142,
  completedTrips: 121_380,
  cancelledTrips: 5_104,
  totalRevenue: 8_452_600,
  todayRevenue: 186_420,
  pendingDriverApplications: 6,
};

export const bookingAnalytics = [
  { label: 'Mon', completed: 2840, cancelled: 96 },
  { label: 'Tue', completed: 3120, cancelled: 112 },
  { label: 'Wed', completed: 2980, cancelled: 88 },
  { label: 'Thu', completed: 3340, cancelled: 124 },
  { label: 'Fri', completed: 3720, cancelled: 148 },
  { label: 'Sat', completed: 4080, cancelled: 132 },
  { label: 'Sun', completed: 3560, cancelled: 104 },
];

export const revenueTrend = [
  { label: 'Aug 1', revenue: 142_500, trips: 3150 },
  { label: 'Aug 2', revenue: 156_200, trips: 3420 },
  { label: 'Aug 3', revenue: 149_800, trips: 3280 },
  { label: 'Aug 4', revenue: 168_400, trips: 3650 },
  { label: 'Aug 5', revenue: 175_900, trips: 3810 },
  { label: 'Aug 6', revenue: 182_300, trips: 3960 },
  { label: 'Aug 7', revenue: 186_420, trips: 4012 },
];

export const recentActivities: RecentActivity[] = [
  { id: 'ra1', type: 'booking', title: 'Booking B-20841 completed', description: 'SM North → Trinoma · ₱95 · Cash', timestamp: '2026-08-07T11:18:00' },
  { id: 'ra2', type: 'driver', title: 'New driver approved', description: 'Jerome Aguirre passed verification', timestamp: '2026-08-07T10:52:00' },
  { id: 'ra3', type: 'payment', title: 'GCash payout processed', description: '₱84,200 to 214 drivers', timestamp: '2026-08-07T10:30:00' },
  { id: 'ra4', type: 'complaint', title: 'Complaint C-112 resolved', description: 'Trip issue closed after review', timestamp: '2026-08-07T09:47:00' },
  { id: 'ra5', type: 'passenger', title: 'New passenger registered', description: 'Angelica Navarro joined HatodGo', timestamp: '2026-08-07T09:12:00' },
  { id: 'ra6', type: 'system', title: 'Surge pricing activated', description: 'EDSA corridor · 1.5x · 5:00 PM window', timestamp: '2026-08-07T08:30:00' },
  { id: 'ra7', type: 'booking', title: 'Booking B-20830 cancelled', description: 'Passenger cancelled · no show', timestamp: '2026-08-07T08:05:00' },
];

export const liveDrivers: LiveDriverStatus[] = [
  { id: 'd1', name: 'Arman Castillo', status: 'On Trip', rating: 4.9, tripsToday: 14, earningsToday: 1480 },
  { id: 'd2', name: 'Ronald Fernandez', status: 'Online', rating: 4.8, tripsToday: 11, earningsToday: 1180 },
  { id: 'd3', name: 'Jomar Reyes', status: 'Online', rating: 4.7, tripsToday: 9, earningsToday: 940 },
  { id: 'd4', name: 'Dennis Aquino', status: 'On Trip', rating: 4.9, tripsToday: 16, earningsToday: 1650 },
  { id: 'd5', name: 'Erwin Santos', status: 'Online', rating: 4.6, tripsToday: 7, earningsToday: 760 },
  { id: 'd6', name: 'Gilbert Ramos', status: 'Offline', rating: 4.9, tripsToday: 0, earningsToday: 0 },
];

export const topDrivers: TopDriver[] = [
  { id: 'd1', name: 'Arman Castillo', rating: 4.9, trips: 1240, earnings: 86400 },
  { id: 'd4', name: 'Dennis Aquino', rating: 4.9, trips: 1185, earnings: 81250 },
  { id: 'd6', name: 'Gilbert Ramos', rating: 4.9, trips: 1102, earnings: 78900 },
  { id: 'd2', name: 'Ronald Fernandez', rating: 4.8, trips: 1050, earnings: 74100 },
  { id: 'd7', name: 'Victor Suarez', rating: 4.8, trips: 986, earnings: 70200 },
  { id: 'd8', name: 'Noel Antonio', rating: 4.8, trips: 924, earnings: 65800 },
];

export const latestBookings: LatestBooking[] = [
  { id: 'B-20841', passengerName: 'Maria Santos', driverName: 'Arman Castillo', route: 'SM North → Trinoma', status: 'Completed', fare: 95, time: '11:04 AM' },
  { id: 'B-20840', passengerName: 'Paolo Mendoza', driverName: 'Dennis Aquino', route: 'BGC → Ayala Ave', status: 'In Progress', fare: 120, time: '11:12 AM' },
  { id: 'B-20839', passengerName: 'Katrina Villanueva', driverName: 'Ronald Fernandez', route: 'Cubao → Pasig City Hall', status: 'Completed', fare: 148, time: '10:48 AM' },
  { id: 'B-20838', passengerName: 'Miguel Tan', driverName: 'Jomar Reyes', route: 'Greenhills → Ortigas', status: 'Accepted', fare: 82, time: '10:36 AM' },
  { id: 'B-20837', passengerName: 'Angela Reyes', driverName: undefined, route: 'Intramuros → Manila Bay', status: 'Searching Driver', fare: 76, time: '10:22 AM' },
  { id: 'B-20836', passengerName: 'Sofia Garcia', driverName: 'Erwin Santos', route: 'Taft Ave → MOA', status: 'Completed', fare: 104, time: '09:58 AM' },
];
