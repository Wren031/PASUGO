import { api } from '@/services';
import type { GroceryOrder, GroceryOrderDraft, GroceryStore } from '@/types/grocery';

export const groceryService = {
  async getStores(): Promise<GroceryStore[]> {
    return api.getStores();
  },

  async searchStores(query: string): Promise<GroceryStore[]> {
    return api.searchStores(query);
  },

  async getStoreById(storeId: string): Promise<GroceryStore> {
    return api.getStoreById(storeId);
  },

  async createGroceryOrder(draft: GroceryOrderDraft): Promise<GroceryOrder> {
    return api.createGroceryOrder(draft);
  },

  async assignGroceryRider(orderId: string): Promise<GroceryOrder> {
    return api.assignGroceryRider(orderId);
  },

  async updateGroceryOrderStatus(
    orderId: string,
    status: GroceryOrder['status'],
    label: string,
    description?: string,
  ): Promise<GroceryOrder> {
    return api.updateGroceryOrderStatus(orderId, status, label, description);
  },

  async getGroceryOrderById(orderId: string): Promise<GroceryOrder> {
    return api.getGroceryOrderById(orderId);
  },
};