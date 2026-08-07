export interface RevenuePeriod {
  label: string;
  revenue: number;
  driverPayout: number;
  companyCommission: number;
}

export interface DriverEarning {
  id: string;
  name: string;
  trips: number;
  grossEarnings: number;
  commission: number;
  netEarnings: number;
}

export interface CommissionSplit {
  totalRevenue: number;
  driverSharePercent: number;
  driverShare: number;
  companyCommissionPercent: number;
  companyCommission: number;
  platformFees: number;
}
