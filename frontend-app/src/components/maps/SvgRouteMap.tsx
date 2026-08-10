import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { RouteMapProps } from './types';

interface Box {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

function expand(box: Box): Box {
  const dLat = Math.max((box.maxLat - box.minLat) * 0.35, 0.01);
  const dLng = Math.max((box.maxLng - box.minLng) * 0.35, 0.01);
  return {
    minLat: box.minLat - dLat,
    maxLat: box.maxLat + dLat,
    minLng: box.minLng - dLng,
    maxLng: box.maxLng + dLng,
  };
}

function seeded(seed: number): number {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
}

interface Roads {
  paths: string[];
  verticals: string[];
}

function buildRoads(box: Box): Roads {
  const paths: string[] = [];
  const verticals: string[] = [];
  const w = box.maxLng - box.minLng;
  const h = box.maxLat - box.minLat;
  for (let i = 0; i < 4; i += 1) {
    const y = 0.2 + seeded(i * 3.7 + 1) * 0.6;
    const slope = (seeded(i * 7.3 + 2) - 0.5) * 0.5;
    const y0 = y * 100 - slope * 0;
    paths.push(
      `M -10 ${(y0 + slope * -10).toFixed(1)} L ${110} ${(y0 + slope * 110).toFixed(1)}`,
    );
    const x = 0.15 + seeded(i * 5.1 + 3) * 0.7;
    verticals.push(
      `M ${(x * 100).toFixed(1)} -10 L ${(x * 100 + (seeded(i * 9.9 + 4) - 0.5) * 20).toFixed(1)} 110`,
    );
  }
  void w;
  void h;
  return { paths, verticals };
}

function markerColor(type: 'pickup' | 'dropoff' | 'driver' | 'passenger'): string {
  switch (type) {
    case 'pickup':
      return '#22C55E';
    case 'dropoff':
      return '#EF4444';
    case 'passenger':
      return '#3B82F6';
    default:
      return '#F97316';
  }
}

function markerGlyph(type: 'pickup' | 'dropoff' | 'driver' | 'passenger'): string {
  switch (type) {
    case 'pickup':
      return 'A';
    case 'dropoff':
      return 'B';
    default:
      return '•';
  }
}

export function SvgRouteMap({ route = [], markers = [], className }: RouteMapProps) {
  const { box, width, height } = useMemo(() => {
    const W = 380;
    const H = 320;
    const points = [...(route ?? []), ...(markers ?? []).map((m) => m.coordinate)];
    const base: Box =
      points.length > 0
        ? {
            minLat: Math.min(...points.map((p) => p.latitude)),
            maxLat: Math.max(...points.map((p) => p.latitude)),
            minLng: Math.min(...points.map((p) => p.longitude)),
            maxLng: Math.max(...points.map((p) => p.longitude)),
          }
        : { minLat: 14.54, maxLat: 14.67, minLng: 120.97, maxLng: 121.1 };
    return { box: expand(base), width: W, height: H };
  }, [route, markers]);

  const project = (lat: number, lng: number) => ({
    x: ((lng - box.minLng) / (box.maxLng - box.minLng)) * width,
    y: ((1 - (lat - box.minLat) / (box.maxLat - box.minLat)) * height) as number,
  });

  const roads = useMemo(() => buildRoads(box), [box]);

  const routeD = useMemo(() => {
    if (route.length < 2) return null;
    return route
      .map((p, i) => {
        const { x, y } = project(p.latitude, p.longitude);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [route, box]);

  return (
    <View className={`flex-1 ${className ?? ''}`}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <Rect x={0} y={0} width={width} height={height} fill="#EEF2F7" />
        {roads.paths.map((d, i) => (
          <Path key={`c${i}`} d={d} stroke="#E2E8F0" strokeWidth={14} strokeLinecap="round" />
        ))}
        {roads.paths.map((d, i) => (
          <Path key={`r${i}`} d={d} stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" />
        ))}
        {roads.verticals.map((d, i) => (
          <Path key={`vc${i}`} d={d} stroke="#E2E8F0" strokeWidth={12} strokeLinecap="round" />
        ))}
        {roads.verticals.map((d, i) => (
          <Path key={`vr${i}`} d={d} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
        ))}
        {routeD ? (
          <>
            <Path d={routeD} stroke="#FDBA74" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d={routeD} stroke="#F97316" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        ) : null}
        {markers.map((marker) => {
          const { x, y } = project(marker.coordinate.latitude, marker.coordinate.longitude);
          const color = markerColor(marker.type);
          return (
            <SvgText key={`label-${marker.id}`} x={x} y={y - 16} fontSize={12} fontWeight="700" fill="#475569" textAnchor="middle">
              {markerGlyph(marker.type)}
            </SvgText>
          );
        })}
        {markers.map((marker) => {
          const { x, y } = project(marker.coordinate.latitude, marker.coordinate.longitude);
          const color = markerColor(marker.type);
          const isEnd = marker.type === 'pickup' || marker.type === 'dropoff';
          return (
            <Circle key={marker.id} cx={x} cy={y} r={isEnd ? 11 : 9} fill={color} stroke="#FFFFFF" strokeWidth={3} />
          );
        })}
        {route.length > 0 && markers.length > 0 ? (
          <Line x1={8} y1={height - 18} x2={width - 8} y2={height - 18} stroke="#E2E8F0" strokeWidth={1} />
        ) : null}
      </Svg>
    </View>
  );
}
