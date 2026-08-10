import type { LatLng } from '@/types/map';

export type MarkerType = 'pickup' | 'dropoff' | 'driver' | 'passenger';

export interface MapMarker {
  id: string;
  coordinate: LatLng;
  type: MarkerType;
  label?: string;
}

export interface RouteMapProps {
  route?: LatLng[];
  markers?: MapMarker[];
  className?: string;
}
