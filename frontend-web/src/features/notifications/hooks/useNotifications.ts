import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import type { NotificationCreatePayload } from '../types';

export function useNotificationStats() {
  return useQuery({ queryKey: ['notifications', 'stats'], queryFn: notificationService.getStats });
}

export function useNotifications() {
  return useQuery({ queryKey: ['notifications'], queryFn: notificationService.getNotifications });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NotificationCreatePayload) => notificationService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
