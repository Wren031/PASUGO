import type { PaymentStats, RefundRequest, Transaction } from '../types';

export const paymentStats: PaymentStats = {
  cashVolume: 3_420_800,
  gcashVolume: 2_980_400,
  cardVolume: 1_240_600,
  walletVolume: 810_800,
  refundRequests: 14,
  failedTransactions: 23,
  totalVolume: 8_452_600,
};

export const transactions: Transaction[] = [
  { id: 't1', reference: 'REF-88231', bookingId: 'B-20841', type: 'Payment', method: 'GCash', passengerName: 'Maria Santos', driverName: 'Arman Castillo', amount: 95, status: 'Success', date: '2026-08-07T11:16:00', fee: 4.75 },
  { id: 't2', reference: 'REF-88230', bookingId: 'B-20840', type: 'Payment', method: 'Wallet', passengerName: 'Paolo Mendoza', driverName: 'Dennis Aquino', amount: 120, status: 'Success', date: '2026-08-07T11:14:00', fee: 0 },
  { id: 't3', reference: 'REF-88229', bookingId: 'B-20839', type: 'Payment', method: 'Cash', passengerName: 'Katrina Villanueva', driverName: 'Ronald Fernandez', amount: 148, status: 'Success', date: '2026-08-07T11:07:00', fee: 0 },
  { id: 't4', reference: 'REF-88228', bookingId: 'B-20838', type: 'Payment', method: 'Cash', passengerName: 'Juan Dela Cruz', driverName: 'Jomar Reyes', amount: 82, status: 'Pending', date: '2026-08-07T10:40:00', fee: 0 },
  { id: 't5', reference: 'REF-88227', bookingId: 'B-20837', type: 'Payment', method: 'Card', passengerName: 'Angela Reyes', amount: 76, status: 'Failed', date: '2026-08-07T10:24:00', fee: 3.8 },
  { id: 't6', reference: 'REF-88226', bookingId: 'B-20836', type: 'Payment', method: 'Cash', passengerName: 'Miguel Tan', driverName: 'Noel Antonio', amount: 84, status: 'Success', date: '2026-08-07T10:09:00', fee: 0 },
  { id: 't7', reference: 'REF-88225', bookingId: 'B-20835', type: 'Payment', method: 'Card', passengerName: 'Sofia Garcia', driverName: 'Victor Suarez', amount: 104, status: 'Success', date: '2026-08-07T08:48:00', fee: 5.2 },
  { id: 't8', reference: 'REF-88224', bookingId: 'B-20830', type: 'Refund', method: 'Card', passengerName: 'Sofia Garcia', amount: 76, status: 'Refunded', date: '2026-08-07T08:15:00', fee: 0 },
  { id: 't9', reference: 'REF-88223', bookingId: 'B-20828', type: 'Payment', method: 'GCash', passengerName: 'Christian Ramos', driverName: 'Victor Suarez', amount: 128, status: 'Success', date: '2026-08-07T07:52:00', fee: 6.4 },
  { id: 't10', reference: 'REF-88222', bookingId: 'B-20825', type: 'Payment', method: 'Cash', passengerName: 'Juan Dela Cruz', driverName: 'Marlon Cruz', amount: 140, status: 'Success', date: '2026-08-07T09:55:00', fee: 0 },
  { id: 't11', reference: 'REF-88221', bookingId: 'B-20821', type: 'Payout', method: 'GCash', passengerName: 'System', driverName: 'Arman Castillo', amount: 18760, status: 'Success', date: '2026-08-07T09:00:00', fee: 0 },
  { id: 't12', reference: 'REF-88220', bookingId: 'B-20819', type: 'Payout', method: 'GCash', passengerName: 'System', driverName: 'Dennis Aquino', amount: 21240, status: 'Failed', date: '2026-08-07T09:01:00', fee: 0 },
  { id: 't13', reference: 'REF-88219', bookingId: 'B-20815', type: 'Payment', method: 'Wallet', passengerName: 'Andrea Lim', driverName: 'Gilbert Ramos', amount: 132, status: 'Success', date: '2026-08-06T20:10:00', fee: 0 },
  { id: 't14', reference: 'REF-88218', bookingId: 'B-20812', type: 'Payment', method: 'GCash', passengerName: 'Katrina Villanueva', driverName: 'Mark Villanueva', amount: 142, status: 'Success', date: '2026-08-06T12:42:00', fee: 7.1 },
];

export const refundRequests: RefundRequest[] = [
  { id: 'r1', reference: 'REF-88217', bookingId: 'B-20830', passengerName: 'Sofia Garcia', amount: 76, reason: 'Driver did not arrive within the ETA window', status: 'Completed', requestedAt: '2026-08-07T08:16:00' },
  { id: 'r2', reference: 'REF-88216', bookingId: 'B-20805', passengerName: 'Juan Dela Cruz', amount: 168, reason: 'Wrong drop-off address charged in fare', status: 'Processing', requestedAt: '2026-08-07T09:30:00' },
  { id: 'r3', reference: 'REF-88215', bookingId: 'B-20788', passengerName: 'Angela Reyes', amount: 92, reason: 'Double charge on card', status: 'Open', requestedAt: '2026-08-07T10:05:00' },
  { id: 'r4', reference: 'REF-88214', bookingId: 'B-20765', passengerName: 'Maria Santos', amount: 88, reason: 'Trip cancelled but fare was charged', status: 'Open', requestedAt: '2026-08-07T10:40:00' },
];
