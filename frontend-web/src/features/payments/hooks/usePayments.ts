import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';

export function usePaymentStats() {
  return useQuery({ queryKey: ['payments', 'stats'], queryFn: paymentService.getStats });
}

export function useTransactions() {
  return useQuery({ queryKey: ['payments', 'transactions'], queryFn: paymentService.getTransactions });
}

export function useRefundRequests() {
  return useQuery({ queryKey: ['payments', 'refunds'], queryFn: paymentService.getRefundRequests });
}
