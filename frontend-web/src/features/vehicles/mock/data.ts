import type { Vehicle, VehicleStats } from '../types';

export const vehicleStats: VehicleStats = {
  total: 3214,
  active: 2987,
  expiringSoon: 42,
  underReview: 18,
};

export const vehicles: Vehicle[] = [
  { id: 'v1', plateNumber: 'ABC-1234', model: 'TMX 125', brand: 'Honda', year: 2023, color: 'Red', driverName: 'Arman Castillo', driverId: 'd1', registrationExpiry: '2027-01-15', insuranceExpiry: '2027-02-10', lastInspection: '2026-07-15', status: 'Active', ownership: 'Owner', tripsCount: 1240 },
  { id: 'v2', plateNumber: 'XYZ-5678', model: 'Mio Soul', brand: 'Yamaha', year: 2022, color: 'Black', driverName: 'Ronald Fernandez', driverId: 'd2', registrationExpiry: '2027-03-22', insuranceExpiry: '2027-04-05', lastInspection: '2026-06-20', status: 'Active', ownership: 'Rent-to-Own', tripsCount: 1050 },
  { id: 'v3', plateNumber: 'QWE-2345', model: 'Skydrive', brand: 'Suzuki', year: 2023, color: 'Silver', driverName: 'Jomar Reyes', driverId: 'd3', registrationExpiry: '2027-07-08', insuranceExpiry: '2026-08-30', lastInspection: '2026-05-12', status: 'Active', ownership: 'Owner', tripsCount: 812 },
  { id: 'v4', plateNumber: 'RTY-7890', model: 'Beat 110', brand: 'Honda', year: 2024, color: 'White', driverName: 'Dennis Aquino', driverId: 'd4', registrationExpiry: '2027-11-03', insuranceExpiry: '2027-11-20', lastInspection: '2026-08-01', status: 'Active', ownership: 'Owner', tripsCount: 1185 },
  { id: 'v5', plateNumber: 'POI-1357', model: 'NMAX', brand: 'Yamaha', year: 2023, color: 'Matte Blue', driverName: 'Mark Villanueva', driverId: 'd5', registrationExpiry: '2026-08-14', insuranceExpiry: '2026-09-01', lastInspection: '2026-04-18', status: 'Expired', ownership: 'Rent-to-Own', tripsCount: 624 },
  { id: 'v6', plateNumber: 'MNB-2468', model: 'PCX 160', brand: 'Honda', year: 2024, color: 'Gray', driverName: 'Gilbert Ramos', driverId: 'd6', registrationExpiry: '2027-05-30', insuranceExpiry: '2027-06-12', lastInspection: '2026-07-02', status: 'Active', ownership: 'Company', tripsCount: 1102 },
  { id: 'v7', plateNumber: 'VFR-9753', model: 'Burgman Street', brand: 'Suzuki', year: 2022, color: 'Black', driverName: 'Victor Suarez', driverId: 'd7', registrationExpiry: '2026-09-21', insuranceExpiry: '2026-10-05', lastInspection: '2026-05-25', status: 'Active', ownership: 'Owner', tripsCount: 986 },
  { id: 'v8', plateNumber: 'UIO-1122', model: 'Click 125', brand: 'Honda', year: 2023, color: 'Blue', driverName: 'Noel Antonio', driverId: 'd8', registrationExpiry: '2027-08-11', insuranceExpiry: '2026-08-15', lastInspection: '2026-06-08', status: 'Under Review', ownership: 'Rent-to-Own', tripsCount: 924 },
  { id: 'v9', plateNumber: 'LOK-8765', model: 'Mio i125', brand: 'Yamaha', year: 2021, color: 'Red', driverName: 'Marlon Cruz', driverId: 'd9', registrationExpiry: '2026-08-02', insuranceExpiry: '2026-07-25', lastInspection: '2026-03-10', status: 'Expired', ownership: 'Owner', tripsCount: 480 },
  { id: 'v10', plateNumber: 'FGH-3344', model: 'Wave 110', brand: 'Honda', year: 2024, color: 'Burgundy', driverName: 'Eric Javier', driverId: 'd10', registrationExpiry: '2027-06-19', insuranceExpiry: '2026-09-14', lastInspection: '2026-07-28', status: 'Under Review', ownership: 'Owner', tripsCount: 128 },
  { id: 'v11', plateNumber: 'JKL-6677', model: 'Aerox 155', brand: 'Yamaha', year: 2024, color: 'White', driverName: 'Enrico Alonzo', driverId: 'd11', registrationExpiry: '2026-12-04', insuranceExpiry: '2027-01-10', lastInspection: '2026-07-10', status: 'Active', ownership: 'Owner', tripsCount: 715 },
  { id: 'v12', plateNumber: 'HGF-9900', model: 'Skydrive Crossover', brand: 'Suzuki', year: 2023, color: 'Matte Gray', driverName: 'Jerome Aguirre', driverId: 'd12', registrationExpiry: '2026-10-12', insuranceExpiry: '2026-11-02', lastInspection: '2026-07-05', status: 'Inactive', ownership: 'Rent-to-Own', tripsCount: 0 },
];
