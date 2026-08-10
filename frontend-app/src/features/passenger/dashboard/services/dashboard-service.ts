import { api } from '@/services';
import type { Passenger } from '@/types/passenger';

export const dashboardService = {
  async getPassenger(userId: string): Promise<Passenger> {
    return api.getPassengerById(userId);
  },
};
