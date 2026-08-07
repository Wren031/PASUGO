export type CityStatus = 'Active' | 'Coming Soon' | 'Restricted';

export interface CityArea {
  id: string;
  name: string;
  barangays: string[];
  coverageZone: 'Metro Manila Core' | 'Metro Manila North' | 'Metro Manila South' | 'Metro Manila East';
  activeDrivers: number;
  status: CityStatus;
}

export interface RestrictedArea {
  id: string;
  name: string;
  city: string;
  rule: string;
  schedule: string;
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  surcharge: boolean;
}
