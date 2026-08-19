import { api } from '@/services';
import type { Merchant } from '@/types/merchant';
import type { PaymentMethodInfo, PaymentTransaction, TopUpOption, WalletAccount } from '@/types/payment';

export const paymentService = {
  async getMethods(userId: string): Promise<PaymentMethodInfo[]> {
    return api.getPaymentMethods(userId);
  },

  async addMethod(userId: string, method: Omit<PaymentMethodInfo, 'id' | 'userId'>): Promise<PaymentMethodInfo[]> {
    return api.addPaymentMethod(userId, method);
  },

  async setDefault(userId: string, methodId: string): Promise<PaymentMethodInfo[]> {
    return api.setDefaultPaymentMethod(userId, methodId);
  },

  async getWallet(userId: string): Promise<WalletAccount> {
    return api.getWallet(userId);
  },

  async topUp(userId: string, amount: number): Promise<WalletAccount> {
    return api.topUpWallet(userId, amount);
  },

  async withdraw(userId: string, amount: number): Promise<WalletAccount> {
    return api.withdrawWallet(userId, amount);
  },

  async getTransactions(userId: string): Promise<PaymentTransaction[]> {
    return api.getTransactions(userId);
  },

  async getTopUpOptions(): Promise<TopUpOption[]> {
    return api.topUpOptions();
  },

  async getMerchants(): Promise<Merchant[]> {
    return api.getMerchants();
  },

  async scanQr(payload: string): Promise<Merchant> {
    return api.getMerchantByQr(payload);
  },

  async payMerchant(
    userId: string,
    merchantId: string,
    amount: number,
  ): Promise<{ wallet: WalletAccount; transaction: PaymentTransaction }> {
    return api.payWithWallet(userId, merchantId, amount);
  },
};
