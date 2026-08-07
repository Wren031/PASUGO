import { mockDelay } from '@/utils/mock';
import type { Booking } from '../types';
import { availableDrivers, bookings, updateBookingStatus } from '../mock/data';

export const bookingService = {
  async getBookings(): Promise<Booking[]> {
    await mockDelay(400);
    return bookings.map((item) => ({ ...item, timeline: [...item.timeline] }));
  },

  async getBookingById(id: string): Promise<Booking | undefined> {
    await mockDelay(300);
    const booking = bookings.find((item) => item.id === id);
    return booking ? { ...booking, timeline: [...booking.timeline] } : undefined;
  },

  async getAvailableDrivers() {
    await mockDelay(300);
    return [...availableDrivers];
  },

  async assignDriver(bookingId: string, driverId: string, driverName: string): Promise<Booking | undefined> {
    await mockDelay(500);
    const updated = updateBookingStatus(bookingId, 'Accepted', driverId, driverName);
    return updated ? { ...updated } : undefined;
  },

  async cancelBooking(bookingId: string): Promise<Booking | undefined> {
    await mockDelay(500);
    const updated = updateBookingStatus(bookingId, 'Cancelled');
    return updated ? { ...updated } : undefined;
  },
};
