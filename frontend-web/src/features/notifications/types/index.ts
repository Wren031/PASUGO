export type NotificationChannel = 'Push' | 'Email' | 'SMS' | 'Promotional' | 'Emergency' | 'Scheduled' | 'Draft';
export type NotificationStatus = 'Sent' | 'Scheduled' | 'Draft' | 'Failed';

export interface AppNotification {
  id: string;
  channel: NotificationChannel;
  title: string;
  message: string;
  audience: string;
  status: NotificationStatus;
  sentCount: number;
  targetCount: number;
  scheduledAt?: string;
  sentAt?: string;
}

export interface NotificationCreatePayload {
  channel: NotificationChannel;
  title: string;
  message: string;
  audience: string;
  schedule?: string;
}

export interface NotificationStats {
  pushSent: number;
  emailSent: number;
  smsSent: number;
  deliveryRate: number;
  scheduled: number;
}
