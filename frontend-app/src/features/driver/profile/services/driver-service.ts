import { api } from '@/services';
import type { Driver, DriverEarningBreakdown } from '@/types/driver';
import type { EarningsReport, DriverTripEarning } from '@/types/driver';
import type { RideRequest } from '@/types/booking';

export const driverService = {
  async getProfile(driverId: string): Promise<Driver> {
    return api.getDriverById(driverId);
  },

  async updateProfile(driverId: string, patch: Partial<{ name: string; email: string }>): Promise<Driver> {
    return api.updateDriver(driverId, patch);
  },

  async getEarnings(driverId: string): Promise<EarningsReport> {
    return api.getDriverEarnings(driverId);
  },

  async getTrips(driverId: string): Promise<DriverTripEarning[]> {
    return api.getTripsByDriver(driverId);
  },

  async getRideRequests(driverId: string): Promise<RideRequest[]> {
    return api.getPendingRideRequests(driverId);
  },

  async addTripEarning(
    record: Omit<DriverTripEarning, 'id'> & { driverId: string; pickup?: string; dropoff?: string },
  ): Promise<DriverTripEarning> {
    return api.addTripEarning(record);
  },
};

export const emptyBreakdown = (): DriverEarningBreakdown => ({
  grossEarnings: 0,
  commission: 0,
  netEarnings: 0,
  bonuses: 0,
  trips: 0,
  distanceKm: 0,
  rating: 0,
});
