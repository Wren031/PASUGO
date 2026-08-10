import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { savedPlaceService } from '../services/saved-place-service';
import type { SavedPlace } from '@/types/passenger';

export function useSavedPlaces(userId: string) {
  return useQuery({
    queryKey: ['saved-places', userId],
    queryFn: () => savedPlaceService.getSavedPlaces(userId),
    enabled: Boolean(userId),
  });
}

export function useAddSavedPlace(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (place: Omit<SavedPlace, 'id'>) => savedPlaceService.addPlace(userId, place),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-places', userId] });
      queryClient.invalidateQueries({ queryKey: ['passenger', userId] });
    },
  });
}

export function useDeleteSavedPlace(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (placeId: string) => savedPlaceService.deletePlace(userId, placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-places', userId] });
      queryClient.invalidateQueries({ queryKey: ['passenger', userId] });
    },
  });
}
