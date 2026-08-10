import type { GeoRoute, LatLng } from '@/types/map';
import { SIMULATION } from '@/constants/fare';

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function estimateDurationMin(distanceKm: number): number {
  return Math.max(2, Math.round((distanceKm / SIMULATION.averageSpeedKmh) * 60));
}

export function interpolate(a: LatLng, b: LatLng, t: number): LatLng {
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: a.longitude + (b.longitude - a.longitude) * t,
  };
}

export function jitter(point: LatLng, maxOffsetDeg = 0.0015): LatLng {
  return {
    latitude: point.latitude + (Math.random() - 0.5) * 2 * maxOffsetDeg,
    longitude: point.longitude + (Math.random() - 0.5) * 2 * maxOffsetDeg,
  };
}

export function buildRoute(from: LatLng, to: LatLng, segments = 12): LatLng[] {
  const points: LatLng[] = [];
  const offset = 0.002;
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const base = interpolate(from, to, t);
    const perpendicular = { latitude: -(to.longitude - from.longitude), longitude: to.latitude - from.latitude };
    const magnitude = Math.hypot(perpendicular.latitude, perpendicular.longitude) || 1;
    const bend = Math.sin(t * Math.PI) * offset * (0.5 + Math.random() * 0.4);
    points.push({
      latitude: base.latitude + (perpendicular.latitude / magnitude) * bend,
      longitude: base.longitude + (perpendicular.longitude / magnitude) * bend,
    });
  }
  return points;
}

export function routeDistanceKm(points: LatLng[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += haversineKm(points[i - 1], points[i]);
  }
  return total;
}

export function createGeoRoute(from: LatLng, to: LatLng): GeoRoute {
  const points = buildRoute(from, to);
  const distanceKm = routeDistanceKm(points);
  return { points, distanceKm, durationMin: estimateDurationMin(distanceKm) };
}

export function combineRoutes(legs: LatLng[][]): LatLng[] {
  const combined: LatLng[] = [];
  legs.forEach((leg, index) => {
    if (index === 0) {
      combined.push(...leg);
    } else {
      combined.push(...leg.slice(1));
    }
  });
  return combined;
}

export function distanceAlongRoute(points: LatLng[], endIndex: number): number {
  let total = 0;
  for (let i = 1; i <= endIndex; i += 1) {
    total += haversineKm(points[i - 1], points[i]);
  }
  return total;
}
