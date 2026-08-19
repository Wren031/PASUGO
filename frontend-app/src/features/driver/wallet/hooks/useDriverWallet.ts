import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/features/passenger/payments/services/payment-service';

export function useWallet(userId: string) {
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => paymentService.getWallet(userId),
    enabled: Boolean(userId),
  });
}

export function useWithdraw(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => paymentService.withdraw(userId, amount),
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