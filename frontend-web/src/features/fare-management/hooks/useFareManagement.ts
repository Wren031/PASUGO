import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fareService } from '../services/fareService';
import type { FareEstimateInput, FareSettings } from '../types';

export function useFareSettings() {
  return useQuery({ queryKey: ['fare-management', 'settings'], queryFn: fareService.getSettings });
}

export function useUpdateFareSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: FareSettings) => fareService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fare-management'] });
    },
  });
}

export function useFareEstimate(input: FareEstimateInput) {
  return useQuery({
    queryKey: ['fare-management', 'estimate', input],
    queryFn: () => fareService.estimateFare(input),
    enabled: input.distanceKm > 0,
  });
}
