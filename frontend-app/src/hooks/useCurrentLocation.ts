import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { LatLng } from '@/types/map';

interface CurrentLocation {
  location: LatLng | null;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useCurrentLocation(): CurrentLocation {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch {
      setError('Unable to determine location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { location, error, loading, refresh };
}
