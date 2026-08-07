import type { PromoCampaign, PromoCode, PromoStats } from '../types';

export const promoStats: PromoStats = {
  activeCodes: 5,
  totalRedemptions: 48210,
  revenueImpact: 1240000,
  avgRedemptionRate: 12.4,
};

export const promoCodes: PromoCode[] = [
  { id: 'pc1', code: 'FIRSTRIDE20', type: 'First Ride', description: '20% off your first ride', value: 20, valueLabel: '20% off', minSpend: 0, maxDiscount: 50, usageCount: 21480, usageCap: 50000, startsAt: '2026-01-01T00:00:00', endsAt: '2026-12-31T23:59:59', status: 'Active' },
  { id: 'pc2', code: 'REFER100', type: 'Referral', description: '₱100 credit for you and your friend', value: 100, valueLabel: '₱100 credit', minSpend: 0, maxDiscount: 100, usageCount: 8230, usageCap: 20000, startsAt: '2026-02-01T00:00:00', endsAt: '2026-12-31T23:59:59', status: 'Active' },
  { id: 'pc3', code: 'HatodGo10', type: 'Discount', description: 'Flat 10% off all rides', value: 10, valueLabel: '10% off', minSpend: 50, maxDiscount: 40, usageCount: 10240, usageCap: 30000, startsAt: '2026-03-15T00:00:00', endsAt: '2026-12-31T23:59:59', status: 'Active' },
  { id: 'pc4', code: 'WEEKEND30', type: 'Discount', description: '30% off weekend rides', value: 30, valueLabel: '30% off', minSpend: 100, maxDiscount: 60, usageCount: 4980, usageCap: 15000, startsAt: '2026-07-01T00:00:00', endsAt: '2026-09-30T23:59:59', status: 'Active' },
  { id: 'pc5', code: 'STUDENT15', type: 'Discount', description: '15% off for verified students', value: 15, valueLabel: '15% off', minSpend: 40, maxDiscount: 30, usageCount: 3280, usageCap: 10000, startsAt: '2026-06-01T00:00:00', endsAt: '2026-08-31T23:59:59', status: 'Active' },
  { id: 'pc6', code: 'MERRYXMAS25', type: 'Discount', description: '25% off holiday season rides', value: 25, valueLabel: '25% off', minSpend: 0, maxDiscount: 75, usageCount: 0, usageCap: 20000, startsAt: '2026-12-01T00:00:00', endsAt: '2026-12-25T23:59:59', status: 'Paused' },
];

export const campaigns: PromoCampaign[] = [
  { id: 'c1', name: 'First Ride Promo', type: 'First Ride', budget: 500000, spent: 214800, redemptions: 21480, conversionRate: 18.2, status: 'Active', endsAt: '2026-12-31T23:59:59' },
  { id: 'c2', name: 'Referral Rewards', type: 'Referral', budget: 400000, spent: 164600, redemptions: 8230, conversionRate: 11.4, status: 'Active', endsAt: '2026-12-31T23:59:59' },
  { id: 'c3', name: 'Back-to-School Discount', type: 'Discount', budget: 250000, spent: 98400, redemptions: 3280, conversionRate: 9.8, status: 'Active', endsAt: '2026-08-31T23:59:59' },
  { id: 'c4', name: 'Weekend Warriors', type: 'Discount', budget: 300000, spent: 298800, redemptions: 4980, conversionRate: 8.6, status: 'Active', endsAt: '2026-09-30T23:59:59' },
  { id: 'c5', name: 'Holiday Campaign 2026', type: 'Discount', budget: 400000, spent: 0, redemptions: 0, conversionRate: 0, status: 'Paused', endsAt: '2026-12-25T23:59:59' },
];
