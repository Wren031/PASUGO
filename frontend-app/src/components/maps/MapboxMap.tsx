import { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE_URL } from '@/constants/maps';
import { MapErrorBoundary } from './MapErrorBoundary';
import { SvgRouteMap } from './SvgRouteMap';
import type { MapMarker, RouteMapProps } from './types';

interface Bounds {
  ne: [number, number];
  sw: [number, number];
}

function markerColor(type: MapMarker['type']): string {
  switch (type) {
    case 'pickup':
      return '#22C55E';
    case 'dropoff':
      return '#EF4444';
    case 'passenger':
      return '#3B82F6';
    case 'driver':
    default:
      return '#F97316';
  }
}

export function MapboxMap({ route, markers = [] }: RouteMapProps) {
  const tokenSet = useRef(false);

  useEffect(() => {
    if (!tokenSet.current) {
      Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
      tokenSet.current = true;
    }
  }, []);

  const fitSignature = useMemo(() => {
    const points = [...(route ?? []), ...markers.map((m) => m.coordinate)];
    if (points.length === 0) return 'none';
    const first = points[0];
    const last = points[points.length - 1];
    return `${first.latitude.toFixed(4)}${first.longitude.toFixed(4)}-${last.latitude.toFixed(4)}${last.longitude.toFixed(4)}`;
  }, [route, markers]);

  const bounds = useMemo<Bounds | undefined>(() => {
    const points = [...(route ?? []), ...markers.map((m) => m.coordinate)];
    if (points.length === 0) return undefined;
    const lats = points.map((p) => p.latitude);
    const lngs = points.map((p) => p.longitude);
    const pad = 0.02;
    return {
      ne: [Math.max(...lngs) + pad, Math.max(...lats) + pad * 0.6],
      sw: [Math.min(...lngs) - pad, Math.min(...lats) - pad * 0.6],
    };
  }, [route, markers]);

  const routeGeo = useMemo(() => {
    if (!route || route.length < 2) return null;
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: route.map((p) => [p.longitude, p.latitude] as [number, number]),
      },
    };
  }, [route]);

  const mapView = (
    <View className="flex-1">
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={MAPBOX_STYLE_URL}
        logoEnabled={false}
        compassEnabled={false}
        attributionEnabled={false}
      >
        {bounds ? <Mapbox.Camera bounds={bounds} animationDuration={0} /> : null}
        {routeGeo ? (
          <Mapbox.ShapeSource id="hatodgo-route" shape={routeGeo}>
            <Mapbox.LineLayer
              id="hatodgo-route-line"
              style={{
                lineColor: '#F97316',
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </Mapbox.ShapeSource>
        ) : null}
        {markers.map((marker) => (
          <Mapbox.PointAnnotation
            key={marker.id}
            id={marker.id}
            coordinate={[marker.coordinate.longitude, marker.coordinate.latitude]}
          >
            <View className="items-center">
              <View
                className="h-5 w-5 rounded-full border-2 border-white"
                style={{ backgroundColor: markerColor(marker.type) }}
              />
            </View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>
      <View className="absolute bottom-2 left-2 flex-row gap-2 rounded-full border border-line bg-white px-3 py-1.5">
        <View className="h-2 w-2 rounded-full bg-success" />
        <View className="h-2 w-2 rounded-full bg-danger" />
        <View className="h-2 w-2 rounded-full bg-primary" />
      </View>
    </View>
  );

  return (
    <MapErrorBoundary fallback={<SvgRouteMap route={route} markers={markers} />}>
      {fitSignature === 'none' ? null : mapView}
    </MapErrorBoundary>
  );
}
