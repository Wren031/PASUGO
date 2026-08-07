import { mockDelay } from '@/utils/mock';
import type { Passenger } from '../types';
import { passengers, updatePassengerStatus } from '../mock/data';

export const passengerService = {
  async getPassengers(): Promise<Passenger[]> {
    await mockDelay(400);
    return passengers.map((item) => ({ ...item }));
  },

  async getPassengerById(id: string): Promise<Passenger | undefined> {
    await mockDelay(300);
    const passenger = passengers.find((item) => item.id === id);
    return passenger ? { ...passenger } : undefined;
  },

  async suspendPassenger(id: string): Promise<Passenger | undefined> {
    await mockDelay(400);
    const updated = updatePassengerStatus(id, 'Suspended');
    return updated ? { ...updated } : undefined;
  },

  async activatePassenger(id: string): Promise<Passenger | undefined> {
    await mockDelay(400);
    const updated = updatePassengerStatus(id, 'Active');
    return updated ? { ...updated } : undefined;
  },
};
