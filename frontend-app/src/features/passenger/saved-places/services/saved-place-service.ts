import { api } from '@/services';
import type { Passenger, SavedPlace } from '@/types/passenger';

export const savedPlaceService = {
  async getSavedPlaces(userId: string): Promise<SavedPlace[]> {
    const passenger = await api.getPassengerById(userId);
    return passenger?.savedPlaces ?? [];
  },

  async addPlace(userId: string, place: Omit<SavedPlace, 'id'>): Promise<Passenger> {
    return api.addSavedPlace(userId, place);
  },

  async deletePlace(userId: string, placeId: string): Promise<Passenger> {
    return api.deleteSavedPlace(userId, placeId);
  },
};
