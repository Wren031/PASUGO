import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/booking-service';
import type { BookingDraft } from '@/types/booking';
import type { LatLng } from '@/types/map';

export function useBookRide() {
  return useMutation({
    mutationFn: (draft: BookingDraft) => bookingService.createBooking(draft),
  });
}

export function useNearbyDrivers(pickup: LatLng | null) {
  return useQuery({
    queryKey: ['nearby-drivers', pickup?.latitude, pickup?.longitude],
    queryFn: () => bookingService.getNearbyDrivers(pickup as LatLng),
    enabled: Boolean(pickup),
    refetchInterval: 3000,
  });
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingService.cancelBooking(id, reason),
  });
}
