import { mockDelay } from '@/utils/mock';
import type { AppNotification, NotificationCreatePayload, NotificationStats } from '../types';
import { createNotification, notifications, notificationStats } from '../mock/data';

export const notificationService = {
  async getStats(): Promise<NotificationStats> {
    await mockDelay(300);
    return { ...notificationStats };
  },
  async getNotifications(): Promise<AppNotification[]> {
    await mockDelay(400);
    return notifications.map((item) => ({ ...item }));
  },
  async create(payload: NotificationCreatePayload): Promise<AppNotification> {
    await mockDelay(500);
    const scheduled = Boolean(payload.schedule);
    const notification: AppNotification = {
      id: `n${Date.now()}`,
      channel: payload.channel,
      title: payload.title,
      message: payload.message,
      audience: payload.audience,
      status: scheduled ? 'Scheduled' : 'Sent',
      sentCount: scheduled ? 0 : 0,
      targetCount: 0,
      scheduledAt: scheduled ? payload.schedule : undefined,
      sentAt: scheduled ? undefined : new Date().toISOString(),
    };
    return createNotification(notification);
  },
};
