import { buildRoute, combineRoutes, routeDistanceKm } from '@/utils/geo';
import type { LatLng } from '@/types/map';
import type { RideRequest } from '@/types/booking';

export interface DriverRoutePlan {
  route: LatLng[];
  leg1Km: number;
  totalKm: number;
  etaMin: number;
}

export function buildDriverRoute(request: RideRequest, driverLocation: LatLng): DriverRoutePlan {
  const leg1 = buildRoute(driverLocation, request.pickupCoordinates);
  const leg2 = buildRoute(request.pickupCoordinates, request.dropoffCoordinates);
  const route = combineRoutes([leg1, leg2]);
  const leg1Km = routeDistanceKm(leg1);
  const totalKm = routeDistanceKm(route);
  const speedKmh = 26;
  return {
    route,
    leg1Km,
    totalKm,
    etaMin: Math.max(2, Math.round((totalKm / speedKmh) * 60)),
  };
}
