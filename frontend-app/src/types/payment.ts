import type { PaymentMethod } from './booking';

export type TransactionType = 'payment' | 'refund' | 'top-up' | 'payout';

export type TransactionStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded';

export interface PaymentMethodInfo {
  id: string;
  userId: string;
  method: PaymentMethod;
  label: string;
  details: string;
  isDefault: boolean;
}

export interface WalletAccount {
  userId: string;
  balance: number;
  currency: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  reference: string;
  bookingId?: string;
  type: TransactionType;
  method: PaymentMethod;
  amount: number;
  status: TransactionStatus;
  date: string;
  description: string;
}

export interface TopUpOption {
  amount: number;
  bonus: number;
}
