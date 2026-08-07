export type VehicleStatus = 'Active' | 'Expired' | 'Under Review' | 'Inactive';

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  driverName: string;
  driverId: string;
  registrationExpiry: string;
  insuranceExpiry: string;
  lastInspection: string;
  status: VehicleStatus;
  ownership: 'Owner' | 'Company' | 'Rent-to-Own';
  tripsCount: number;
}

export interface VehicleStats {
  total: number;
  active: number;
  expiringSoon: number;
  underReview: number;
}
