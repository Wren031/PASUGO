import type { CommissionSplit, DriverEarning, RevenuePeriod } from '../types';

export const dailyRevenue: RevenuePeriod[] = [
  { label: 'Aug 1', revenue: 142500, driverPayout: 114000, companyCommission: 28500 },
  { label: 'Aug 2', revenue: 156200, driverPayout: 124960, companyCommission: 31240 },
  { label: 'Aug 3', revenue: 149800, driverPayout: 119840, companyCommission: 29960 },
  { label: 'Aug 4', revenue: 168400, driverPayout: 134720, companyCommission: 33680 },
  { label: 'Aug 5', revenue: 175900, driverPayout: 140720, companyCommission: 35180 },
  { label: 'Aug 6', revenue: 182300, driverPayout: 145840, companyCommission: 36460 },
  { label: 'Aug 7', revenue: 186420, driverPayout: 149136, companyCommission: 37284 },
];

export const weeklyRevenue: RevenuePeriod[] = [
  { label: 'W1', revenue: 980200, driverPayout: 784160, companyCommission: 196040 },
  { label: 'W2', revenue: 1045600, driverPayout: 836480, companyCommission: 209120 },
  { label: 'W3', revenue: 1012300, driverPayout: 809840, companyCommission: 202460 },
  { label: 'W4', revenue: 1098400, driverPayout: 878720, companyCommission: 219680 },
  { label: 'W5', revenue: 1120500, driverPayout: 896400, companyCommission: 224100 },
  { label: 'W6', revenue: 1186400, driverPayout: 949120, companyCommission: 237280 },
  { label: 'W7', revenue: 1159800, driverPayout: 927840, companyCommission: 231960 },
  { label: 'W8', revenue: 1214600, driverPayout: 971680, companyCommission: 242920 },
];

export const monthlyRevenue: RevenuePeriod[] = [
  { label: 'Feb', revenue: 3120000, driverPayout: 2496000, companyCommission: 624000 },
  { label: 'Mar', revenue: 3480000, driverPayout: 2784000, companyCommission: 696000 },
  { label: 'Apr', revenue: 3710000, driverPayout: 2968000, companyCommission: 742000 },
  { label: 'May', revenue: 3940000, driverPayout: 3152000, companyCommission: 788000 },
  { label: 'Jun', revenue: 4280000, driverPayout: 3424000, companyCommission: 856000 },
  { label: 'Jul', revenue: 4526000, driverPayout: 3620800, companyCommission: 905200 },
];

export const driverEarnings: DriverEarning[] = [
  { id: 'd1', name: 'Arman Castillo', trips: 1240, grossEarnings: 86400, commission: 17280, netEarnings: 69120 },
  { id: 'd4', name: 'Dennis Aquino', trips: 1185, grossEarnings: 81250, commission: 16250, netEarnings: 65000 },
  { id: 'd6', name: 'Gilbert Ramos', trips: 1102, grossEarnings: 78900, commission: 15780, netEarnings: 63120 },
  { id: 'd2', name: 'Ronald Fernandez', trips: 1050, grossEarnings: 74100, commission: 14820, netEarnings: 59280 },
  { id: 'd7', name: 'Victor Suarez', trips: 986, grossEarnings: 70200, commission: 14040, netEarnings: 56160 },
  { id: 'd8', name: 'Noel Antonio', trips: 924, grossEarnings: 65800, commission: 13160, netEarnings: 52640 },
  { id: 'd3', name: 'Jomar Reyes', trips: 812, grossEarnings: 56800, commission: 11360, netEarnings: 45440 },
  { id: 'd5', name: 'Mark Villanueva', trips: 624, grossEarnings: 41200, commission: 8240, netEarnings: 32960 },
];

export const commissionSplit: CommissionSplit = {
  totalRevenue: 4526000,
  driverSharePercent: 80,
  driverShare: 3620800,
  companyCommissionPercent: 20,
  companyCommission: 905200,
  platformFees: 124000,
};
