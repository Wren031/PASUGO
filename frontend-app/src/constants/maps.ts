import type { LatLng } from '@/types/map';

/**
 * Mapbox public access token.
 *
 * Add your own token from https://account.mapbox.com/access-tokens/
 * The app renders a stylized SVG fallback map when no valid token is set.
 */
export const MAPBOX_ACCESS_TOKEN = 'pk.PUT_YOUR_MAPBOX_PUBLIC_TOKEN_HERE';

export const MAPBOX_STYLE_URL = 'mapbox://styles/mapbox/navigation-day-v1';

export const canUseMapbox =
  MAPBOX_ACCESS_TOKEN.startsWith('pk.') && !MAPBOX_ACCESS_TOKEN.includes('PUT_YOUR');

export interface Landmark {
  id: string;
  name: string;
  address: string;
  coordinates: LatLng;
}

export const LANDMARKS: Landmark[] = [
  { id: 'lm-cubao', name: 'Cubao Farmers Market', address: 'P. Tuazon Blvd, Cubao, Quezon City', coordinates: { latitude: 14.6194, longitude: 121.0497 } },
  { id: 'lm-trinoma', name: 'SM North EDSA', address: 'North Ave, Quezon City', coordinates: { latitude: 14.6535, longitude: 121.0324 } },
  { id: 'lm-bgc', name: 'Bonifacio High Street', address: '9th Ave, BGC, Taguig', coordinates: { latitude: 14.5515, longitude: 121.0508 } },
  { id: 'lm-makati', name: 'Ayala Triangle', address: 'Ayala Ave, Makati City', coordinates: { latitude: 14.5547, longitude: 121.0244 } },
  { id: 'lm-ortigas', name: 'Ortigas Center', address: 'Exchange Road, Pasig City', coordinates: { latitude: 14.5844, longitude: 121.0608 } },
  { id: 'lm-greenhills', name: 'Greenhills Shopping Center', address: 'Greenhills, San Juan', coordinates: { latitude: 14.6093, longitude: 121.0451 } },
  { id: 'lm-pasig', name: 'Pasig City Hall', address: 'Caruncho Ave, Pasig City', coordinates: { latitude: 14.5592, longitude: 121.0747 } },
  { id: 'lm-intramuros', name: 'Intramuros', address: 'General Luna St, Manila', coordinates: { latitude: 14.5906, longitude: 120.9761 } },
  { id: 'lm-mbpa', name: 'Manila Baywalk', address: 'Roxas Blvd, Manila', coordinates: { latitude: 14.5617, longitude: 120.9804 } },
  { id: 'lm-uptown', name: 'Uptown BGC', address: '9th Ave cor 38th St, Taguig', coordinates: { latitude: 14.5484, longitude: 121.0495 } },
  { id: 'lm-taft', name: 'Taft Avenue', address: 'Taft Ave, Pasay', coordinates: { latitude: 14.543, longitude: 120.9956 } },
  { id: 'lm-banawe', name: 'Banawe Street', address: 'Banawe Ave, Quezon City', coordinates: { latitude: 14.6268, longitude: 121.0035 } },
  { id: 'lm-marikina', name: 'Marikina City Hall', address: 'Shoe Ave, Marikina City', coordinates: { latitude: 14.6353, longitude: 121.0969 } },
  { id: 'lm-commonwealth', name: 'Commonwealth Avenue', address: 'Commonwealth Ave, QC', coordinates: { latitude: 14.6683, longitude: 121.07 } },
  { id: 'lm-quiapo', name: 'Quiapo Church', address: 'Plaza Miranda, Manila', coordinates: { latitude: 14.5989, longitude: 120.9834 } },
  { id: 'lm-marketmarket', name: 'Market! Market!', address: '9th Ave, BGC, Taguig', coordinates: { latitude: 14.5429, longitude: 121.0571 } },
];

export function findLandmarkByName(name: string): Landmark | undefined {
  return LANDMARKS.find(
    (l) => l.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(l.name.toLowerCase()),
  );
}
