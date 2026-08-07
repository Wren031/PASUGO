import { mockDelay } from '@/utils/mock';
import type { Vehicle, VehicleStats } from '../types';
import { vehicles, vehicleStats } from '../mock/data';

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    await mockDelay(400);
    return vehicles.map((item) => ({ ...item }));
  },

  async getVehicleStats(): Promise<VehicleStats> {
    await mockDelay(300);
    return { ...vehicleStats };
  },
};
