import type { FareSettings } from '../types';

export const defaultFareSettings: FareSettings = {
  baseFare: 40,
  pricePerKm: 12,
  pricePerMinute: 2,
  bookingFee: 10,
  surgeMultiplier: 1.5,
  surgeHours: '6:00 AM – 9:00 AM · 5:00 PM – 9:00 PM',
  holidayRate: 1.25,
  nightRate: 1.2,
  nightHours: '10:00 PM – 5:00 AM',
  minimumFare: 60,
};

export const fareHistory = [
  { date: '2026-07-01', note: 'Price per km adjusted from ₱11 to ₱12 (LTO fuel surcharge)', changedBy: 'Alex Montenegro' },
  { date: '2026-04-15', note: 'Booking fee introduced at ₱10 to cover insurance costs', changedBy: 'Alex Montenegro' },
  { date: '2026-01-05', note: 'Base fare raised from ₱35 to ₱40', changedBy: 'Finance Team' },
  { date: '2025-10-01', note: 'Night rate increased from 1.15x to 1.2x', changedBy: 'Operations Team' },
];
