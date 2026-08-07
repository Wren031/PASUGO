import { mockDelay } from '@/utils/mock';
import type { PromoCampaign, PromoCode, PromoStats } from '../types';
import { campaigns, promoCodes, promoStats } from '../mock/data';

export const promoService = {
  async getStats(): Promise<PromoStats> {
    await mockDelay(300);
    return { ...promoStats };
  },
  async getPromoCodes(): Promise<PromoCode[]> {
    await mockDelay(400);
    return promoCodes.map((item) => ({ ...item }));
  },
  async getCampaigns(): Promise<PromoCampaign[]> {
    await mockDelay(300);
    return campaigns.map((item) => ({ ...item }));
  },
};
