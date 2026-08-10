export type NotificationType = 'booking' | 'ride-request' | 'earning' | 'promotion' | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}
