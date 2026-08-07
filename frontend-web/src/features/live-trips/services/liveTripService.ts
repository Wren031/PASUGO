import { mockDelay } from '@/utils/mock';
import type { LiveTrip, TripStats } from '../types';
import { liveTrips, tripStats } from '../mock/data';

export const liveTripService = {
  async getTripStats(): Promise<TripStats> {
    await mockDelay(250);
    return { ...tripStats };
  },

  async getLiveTrips(): Promise<LiveTrip[]> {
    await mockDelay(250);
    return liveTrips.map((trip) => ({ ...trip }));
  },
};
