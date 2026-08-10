import { FARE } from '@/constants/fare';
import { createGeoRoute, estimateDurationMin } from './geo';
import type { LatLng } from '@/types/map';
import type { FareBreakdown } from '@/types/booking';

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

export function computeFare(pickup: LatLng, dropoff: LatLng): FareBreakdown {
  const route = createGeoRoute(pickup, dropoff);
  const baseFare = FARE.baseFare;
  const distanceCharge = Math.round(route.distanceKm * FARE.perKm);
  const timeCharge = Math.round(estimateDurationMin(route.distanceKm) * FARE.perMinute);
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
