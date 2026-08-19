import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/features/passenger/payments/services/payment-service';

export function useMerchants() {
  return useQuery({
    queryKey: ['merchants'],
    queryFn: () => paymentService.getMerchants(),
  });
}

export function useScanQr(payload: string) {
  return useQuery({
    queryKey: ['merchant-qr', payload],
    queryFn: () => paymentService.scanQr(payload),
    enabled: Boolean(payload),
    retry: false,
  });
}

export function usePayMerchant(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { merchantId: string; amount: number }) =>
      paymentService.payMerchant(userId, input.merchantId, input.amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', userId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
    },
  });
}
