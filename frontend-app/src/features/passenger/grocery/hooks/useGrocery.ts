import { useMutation, useQuery } from '@tanstack/react-query';
import { groceryService } from '../services/grocery-service';
import type { GroceryOrderDraft } from '@/types/grocery';

export function useStores(query: string) {
  return useQuery({
    queryKey: ['grocery-stores', query],
    queryFn: () => (query.trim() ? groceryService.searchStores(query) : groceryService.getStores()),
  });
}

export function useStore(storeId: string) {
  return useQuery({
    queryKey: ['grocery-store', storeId],
    queryFn: () => groceryService.getStoreById(storeId),
  });
}

export function useCreateGroceryOrder() {
  return useMutation({
    mutationFn: (draft: GroceryOrderDraft) => groceryService.createGroceryOrder(draft),
  });
}

export function useAssignGroceryRider() {
  return useMutation({
    mutationFn: (orderId: string) => groceryService.assignGroceryRider(orderId),
  });
}

export function useUpdateGroceryOrderStatus() {
  return useMutation({
    mutationFn: ({
      orderId,
      status,
      label,
      description,
    }: {
      orderId: string;
      status: Parameters<typeof groceryService.updateGroceryOrderStatus>[1];
      label: string;
      description?: string;
    }) => groceryService.updateGroceryOrderStatus(orderId, status, label, description),
  });
}