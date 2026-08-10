import { useMemo } from 'react';
import { Platform, View } from 'react-native';
import { canUseMapbox } from '@/constants/maps';
import { SvgRouteMap } from './SvgRouteMap';
import { MapboxMap } from './MapboxMap';
import type { RouteMapProps } from './types';

/**
 * Renders the live route map.
 *
 * Uses Mapbox GL Native when a valid access token is configured and the
 * native module is available (development builds). Falls back to a
 * stylized SVG map in Expo Go / web / missing token so tracking screens
 * always render.
 */
export function MapContainer(props: RouteMapProps) {
  const canNative = canUseMapbox && Platform.OS !== 'web';

  const NativeMap = useMemo(() => {
    if (!canNative) return null;
    try {
      const module = require('./MapboxMap') as { MapboxMap: typeof MapboxMap };
      return module.MapboxMap;
    } catch {
      return null;
    }
  }, [canNative]);

  return (
    <View className={`overflow-hidden rounded-2xl border border-line bg-slate-100 ${props.className ?? ''}`}>
      {NativeMap ? <NativeMap {...props} /> : <SvgRouteMap {...props} />}
    </View>
  );
}
