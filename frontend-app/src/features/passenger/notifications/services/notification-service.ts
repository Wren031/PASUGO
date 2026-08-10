import { api } from '@/services';
import type { AppNotification } from '@/types/notification';

export const notificationService = {
  async getNotifications(userId: string): Promise<AppNotification[]> {
    return api.getNotifications(userId);
  },

  async markRead(userId: string, notificationId: string): Promise<void> {
    await api.markNotificationRead(notificationId);
  },

  async markAllRead(userId: string): Promise<void> {
    await api.markAllNotificationsRead(userId);
  },
};
