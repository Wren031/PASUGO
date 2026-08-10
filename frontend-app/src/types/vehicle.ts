export type VehicleStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Under Review';

export type VehicleOwnership = 'Owner' | 'Company' | 'Rent-to-Own';

export interface Vehicle {
  id: string;
  driverId: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  ownership: VehicleOwnership;
  registrationExpiry: string;
  insuranceExpiry: string;
  lastInspection: string;
  status: VehicleStatus;
  tripsCount: number;
}

export interface VehicleDocument {
  id: string;
  label: string;
  description: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  expiry?: string;
  note?: string;
}
