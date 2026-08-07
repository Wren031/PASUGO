import { mockDelay } from '@/utils/mock';
import type { CityArea, OperatingHours, RestrictedArea } from '../types';
import { cities, operatingHours, restrictedAreas } from '../mock/data';

export const serviceAreaService = {
  async getCities(): Promise<CityArea[]> {
    await mockDelay(400);
    return cities.map((item) => ({ ...item, barangays: [...item.barangays] }));
  },
  async getRestrictedAreas(): Promise<RestrictedArea[]> {
    await mockDelay(300);
    return restrictedAreas.map((item) => ({ ...item }));
  },
  async getOperatingHours(): Promise<OperatingHours[]> {
    await mockDelay(300);
    return operatingHours.map((item) => ({ ...item }));
  },
};
