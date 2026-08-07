import { mockDelay } from '@/utils/mock';
import type { Driver } from '../types';
import { drivers, updateDriverStatus } from '../mock/data';

export const driverService = {
  async getDrivers(): Promise<Driver[]> {
    await mockDelay(400);
    return drivers.map((item) => ({ ...item }));
  },

  async getDriverById(id: string): Promise<Driver | undefined> {
    await mockDelay(300);
    const driver = drivers.find((item) => item.id === id);
    return driver ? { ...driver } : undefined;
  },

  async suspendDriver(id: string): Promise<Driver | undefined> {
    await mockDelay(400);
    const updated = updateDriverStatus(id, 'Suspended');
    return updated ? { ...updated } : undefined;
  },

  async activateDriver(id: string): Promise<Driver | undefined> {
    await mockDelay(400);
    const updated = updateDriverStatus(id, 'Active');
    return updated ? { ...updated } : undefined;
  },
};
