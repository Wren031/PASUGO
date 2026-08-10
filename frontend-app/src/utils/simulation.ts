import type { LatLng } from '@/types/map';
import { haversineKm } from './geo';

/** Distance (km) a vehicle covers in one simulation tick. */
export function distancePerTick(speedKmh: number, timeScale: number, tickMs: number): number {
  return (speedKmh * timeScale * tickMs) / 3_600_000;
}

/** Point + cumulative distance at a given progress along a route. */
export function pointAlongRoute(route: LatLng[], distanceKm: number): LatLng {
  if (route.length === 0) return { latitude: 0, longitude: 0 };
  if (route.length === 1 || distanceKm <= 0) return route[0];
  let traveled = 0;
  for (let i = 1; i < route.length; i += 1) {
    const segmentKm = haversineKm(route[i - 1], route[i]);
    if (traveled + segmentKm >= distanceKm) {
      const t = (distanceKm - traveled) / segmentKm;
      return {
        latitude: route[i - 1].latitude + (route[i].latitude - route[i - 1].latitude) * t,
        longitude: route[i - 1].longitude + (route[i].longitude - route[i - 1].longitude) * t,
      };
    }
    traveled += segmentKm;
  }
  return route[route.length - 1];
}

export function remainingKm(route: LatLng[], distanceKm: number): number {
  const total = route.reduce((sum, point, index) => {
    if (index === 0) return sum;
    return sum + haversineKm(route[index - 1], point);
  }, 0);
  return Math.max(0, total - distanceKm);
}

export function etaMinutes(remainingKmValue: number, speedKmh: number): number {
  return Math.max(1, Math.round((remainingKmValue / speedKmh) * 60));
}
