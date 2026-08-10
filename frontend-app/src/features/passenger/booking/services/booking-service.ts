import { api } from '@/services';
import type { AvailableDriver, Booking, BookingDraft } from '@/types/booking';
import type { LatLng } from '@/types/map';

export const bookingService = {
  async createBooking(draft: BookingDraft): Promise<Booking> {
    return api.createBooking(draft);
  },

  async getNearbyDrivers(from: LatLng): Promise<AvailableDriver[]> {
    return api.getNearbyDrivers(from);
  },

  async cancelBooking(id: string, reason: string): Promise<Booking> {
    return api.cancelBooking(id, reason);
  },

  async updateBookingStatus(id: string, status: Booking['status'], label: string): Promise<Booking> {
    return api.updateBookingStatus(id, status, label);
  },
};
