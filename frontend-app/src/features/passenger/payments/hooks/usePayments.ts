import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/payment-service';
import type { PaymentMethodInfo } from '@/types/payment';

export function usePaymentMethods(userId: string) {
  return useQuery({
    queryKey: ['payment-methods', userId],
    queryFn: () => paymentService.getMethods(userId),
    enabled: Boolean(userId),
  });
}

export function useSetDefaultPayment(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (methodId: string) => paymentService.setDefault(userId, methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods', userId] });
    },
  });
}

export function useAddPaymentMethod(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (method: Omit<PaymentMethodInfo, 'id' | 'userId'>) => paymentService.addMethod(userId, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods', userId] });
    },
  });
}

export function useWallet(userId: string) {
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => paymentService.getWallet(userId),
    enabled: Boolean(userId),
  });
}

export function useTopUp(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => paymentService.topUp(userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', userId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
    },
  });
}

export function useTransactions(userId: string) {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => paymentService.getTransactions(userId),
    enabled: Boolean(userId),
  });
}

export function useTopUpOptions() {
  return useQuery({ queryKey: ['topup-options'], queryFn: () => paymentService.getTopUpOptions() });
}
