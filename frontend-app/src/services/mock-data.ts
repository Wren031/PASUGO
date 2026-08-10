import users from '@/mock/users.json';
import drivers from '@/mock/drivers.json';
import passengers from '@/mock/passengers.json';
import bookings from '@/mock/bookings.json';
import trips from '@/mock/trips.json';
import payments from '@/mock/payments.json';
import notifications from '@/mock/notifications.json';
import reviews from '@/mock/reviews.json';
import vehicles from '@/mock/vehicles.json';

import type { Booking } from '@/types/booking';
import type { Driver } from '@/types/driver';
import type { AppNotification } from '@/types/notification';
import type { Passenger } from '@/types/passenger';
import type { PaymentMethodInfo, PaymentTransaction, WalletAccount } from '@/types/payment';
import type { Review } from '@/types/review';
import type { User } from '@/types/user';
import type { Vehicle } from '@/types/vehicle';

type UserRecord = User & { password: string };

interface PaymentsPayload {
  paymentMethods: PaymentMethodInfo[];
  wallets: WalletAccount[];
  transactions: PaymentTransaction[];
}

export const mockData = {
  users: users as UserRecord[],
  drivers: drivers as Driver[],
  passengers: passengers as Passenger[],
  bookings: bookings as Booking[],
  trips,
  payments: payments as PaymentsPayload,
  notifications: notifications as AppNotification[],
  reviews: reviews as Review[],
  vehicles: vehicles as Vehicle[],
};
