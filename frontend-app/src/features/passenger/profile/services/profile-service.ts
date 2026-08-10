import { api } from '@/services';
import type { Passenger } from '@/types/passenger';

export const passengerService = {
  async getProfile(userId: string): Promise<Passenger> {
    return api.getPassengerById(userId);
  },

  async updateProfile(
    userId: string,
    patch: Partial<{ name: string; email: string; homeLocation: string; workLocation: string }>,
  ): Promise<Passenger> {
    return api.updatePassenger(userId, patch);
  },
};
