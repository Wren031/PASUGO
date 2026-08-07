import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';

export function useBookings() {
  return useQuery({ queryKey: ['bookings'], queryFn: bookingService.getBookings, refetchInterval: 15_000 });
}

export function useBooking(id: string) {
  return useQuery({ queryKey: ['bookings', id], queryFn: () => bookingService.getBookingById(id) });
}

export function useAvailableDrivers() {
  return useQuery({ queryKey: ['bookings', 'available-drivers'], queryFn: bookingService.getAvailableDrivers });
}

export function useAssignDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, driverId, driverName }: { bookingId: string; driverId: string; driverName: string }) =>
      bookingService.assignDriver(bookingId, driverId, driverName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
