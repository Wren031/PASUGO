export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface RoutePoint extends LatLng {}

export interface GeoRoute {
  points: LatLng[];
  distanceKm: number;
  durationMin: number;
}
