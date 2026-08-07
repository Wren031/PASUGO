import { useQuery } from '@tanstack/react-query';
import { promoService } from '../services/promoService';

export function usePromoStats() {
  return useQuery({ queryKey: ['promotions', 'stats'], queryFn: promoService.getStats });
}

export function usePromoCodes() {
  return useQuery({ queryKey: ['promotions', 'codes'], queryFn: promoService.getPromoCodes });
}

export function usePromoCampaigns() {
  return useQuery({ queryKey: ['promotions', 'campaigns'], queryFn: promoService.getCampaigns });
}
