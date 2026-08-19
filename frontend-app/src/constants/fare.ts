export const FARE = {
  baseFare: 40,
  perKm: 15,
  perMinute: 2,
  bookingFee: 15,
  carMultiplier: 1.7,
  driverCommissionPercent: 20,
  driverSharePercent: 80,
  freeRideMinimum: 0,
} as const;

export const SIMULATION = {
  tickMs: 1000,
  demoTimeScale: 24,
  averageSpeedKmh: 26,
  searchDurationMs: 4000,
  arrivingHoldMs: 3000,
  pickedUpHoldMs: 2500,
  requestResponseSeconds: 30,
} as const;
