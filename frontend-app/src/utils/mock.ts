import { FARE } from '@/constants/fare';
import { createGeoRoute, estimateDurationMin } from './geo';
import type { LatLng } from '@/types/map';
import type { FareBreakdown, VehicleType } from '@/types/booking';

export const mockDelay = (ms = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function computeFare(
  pickup: LatLng,
  dropoff: LatLng,
  vehicle: VehicleType = 'motorcycle',
): FareBreakdown {
  const route = createGeoRoute(pickup, dropoff);
  const multiplier = vehicle === 'car' ? FARE.carMultiplier : 1;
  const baseFare = Math.round(FARE.baseFare * multiplier);
  const distanceCharge = Math.round(route.distanceKm * FARE.perKm * multiplier);
  const timeCharge = Math.round(estimateDurationMin(route.distanceKm) * FARE.perMinute * multiplier);
  const bookingFee = FARE.bookingFee;
  const discount = 0;
  const surgeMultiplier = 1;
  const total = Math.max(
    FARE.freeRideMinimum,
    baseFare + distanceCharge + timeCharge + bookingFee - discount,
  );
  return { baseFare, distanceCharge, timeCharge, bookingFee, discount, surgeMultiplier, total };
}

export function generateId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${random}`;
}

export function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
