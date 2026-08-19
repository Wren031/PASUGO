import { api } from '@/services';
import type { AvailableDriver, Booking, BookingDraft, VehicleType } from '@/types/booking';
import type { LatLng } from '@/types/map';

export const bookingService = {
  async createBooking(draft: BookingDraft): Promise<Booking> {
    return api.createBooking(draft);
  },

  async getNearbyDrivers(from: LatLng, vehicleType?: VehicleType): Promise<AvailableDriver[]> {
    return api.getNearbyDrivers(from, 4, vehicleType);
  },

  async cancelBooking(id: string, reason: string): Promise<Booking> {
    return api.cancelBooking(id, reason);
  },

  async updateBookingStatus(id: string, status: Booking['status'], label: string): Promise<Booking> {
    return api.updateBookingStatus(id, status, label);
  },
};
