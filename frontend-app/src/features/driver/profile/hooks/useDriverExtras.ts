import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services';
import { useAuthStore } from '@/store/auth-store';
import type { ReviewSubmission } from '@/types/review';

export function useDriverVehicle(driverId: string) {
  return useQuery({
    queryKey: ['driver-vehicle', driverId],
    queryFn: () => api.getVehicleByDriverId(driverId),
    enabled: Boolean(driverId),
  });
}

export function useDriverDocuments(driverId: string) {
  return useQuery({
    queryKey: ['driver-documents', driverId],
    queryFn: () => api.getDriverDocuments(driverId),
    enabled: Boolean(driverId),
  });
}

export function useDriverReviews(driverId: string) {
  return useQuery({
    queryKey: ['driver-reviews', driverId],
    queryFn: () => api.getReviewsForTarget(driverId),
    enabled: Boolean(driverId),
  });
}

export function useDriverNotifications(driverId: string) {
  return useQuery({
    queryKey: ['driver-notifications', driverId],
    queryFn: () => api.getNotifications(driverId),
    enabled: Boolean(driverId),
  });
}

export function useDriverNotificationActions(driverId: string) {
  const queryClient = useQueryClient();
  const markRead = useMutation({
    mutationFn: (notificationId: string) => api.markNotificationRead(notificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['driver-notifications', driverId] }),
  });
  const markAllRead = useMutation({
    mutationFn: () => api.markAllNotificationsRead(driverId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['driver-notifications', driverId] }),
  });
  return { markRead, markAllRead };
}

export function useSubmitDriverReview() {
  const user = useAuthStore((state) => state.session?.user);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submission: Omit<ReviewSubmission, 'authorName' | 'authorRole'>) =>
      api.submitReview({
        ...submission,
        authorName: user?.name ?? 'Passenger',
        authorRole: 'passenger',
      }),
    onSuccess: (_review, submission) => {
      queryClient.invalidateQueries({ queryKey: ['driver-reviews', submission.targetId] });
    },
  });
}
