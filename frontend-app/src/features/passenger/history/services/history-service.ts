import { api } from '@/services';
import type { Booking } from '@/types/booking';

export const historyService = {
  async getBookings(passengerId: string): Promise<Booking[]> {
    return api.getBookingsByPassenger(passengerId);
  },

  async getBooking(id: string): Promise<Booking> {
    return api.getBookingById(id);
  },
};
