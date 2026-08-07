export type PromoType = 'Discount' | 'Referral' | 'First Ride';
export type PromoStatus = 'Active' | 'Expired' | 'Paused';

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  description: string;
  value: number;
  valueLabel: string;
  minSpend: number;
  maxDiscount: number;
  usageCount: number;
  usageCap: number;
  startsAt: string;
  endsAt: string;
  status: PromoStatus;
}

export interface PromoCampaign {
  id: string;
  name: string;
  type: PromoType;
  budget: number;
  spent: number;
  redemptions: number;
  conversionRate: number;
  status: PromoStatus;
  endsAt: string;
}

export interface PromoStats {
  activeCodes: number;
  totalRedemptions: number;
  revenueImpact: number;
  avgRedemptionRate: number;
}
