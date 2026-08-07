export type PaymentMethod = 'Cash' | 'GCash' | 'Card' | 'Wallet';
export type TransactionStatus = 'Success' | 'Failed' | 'Pending' | 'Refunded';
export type TransactionType = 'Payment' | 'Refund' | 'Payout';

export interface Transaction {
  id: string;
  reference: string;
  bookingId: string;
  type: TransactionType;
  method: PaymentMethod;
  passengerName: string;
  driverName?: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  fee: number;
}

export interface PaymentStats {
  cashVolume: number;
  gcashVolume: number;
  cardVolume: number;
  walletVolume: number;
  refundRequests: number;
  failedTransactions: number;
  totalVolume: number;
}

export interface RefundRequest {
  id: string;
  reference: string;
  bookingId: string;
  passengerName: string;
  amount: number;
  reason: string;
  status: 'Open' | 'Processing' | 'Completed' | 'Rejected';
  requestedAt: string;
}
