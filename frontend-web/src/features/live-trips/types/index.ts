export interface LiveTrip {
  id: string;
  bookingId: string;
  driverId: string;
  driverName: string;
  driverRating: number;
  passengerName: string;
  pickup: string;
  dropoff: string;
  etaMin: number;
  distanceKm: number;
  progress: number;
  startedAt: string;
  paymentMethod: string;
}

export interface TripStats {
  activeTrips: number;
  driversOnline: number;
  avgEtaMin: number;
  completedToday: number;
}
