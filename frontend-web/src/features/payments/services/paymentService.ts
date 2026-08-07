import { mockDelay } from '@/utils/mock';
import type { PaymentStats, RefundRequest, Transaction } from '../types';
import { paymentStats, refundRequests, transactions } from '../mock/data';

export const paymentService = {
  async getStats(): Promise<PaymentStats> {
    await mockDelay(300);
    return { ...paymentStats };
  },
  async getTransactions(): Promise<Transaction[]> {
    await mockDelay(400);
    return transactions.map((item) => ({ ...item }));
  },
  async getRefundRequests(): Promise<RefundRequest[]> {
    await mockDelay(300);
    return refundRequests.map((item) => ({ ...item }));
  },
};
