import type { AppNotification, NotificationStats } from '../types';

export const notificationStats: NotificationStats = {
  pushSent: 48200,
  emailSent: 31400,
  smsSent: 12800,
  deliveryRate: 97.2,
  scheduled: 3,
};

export const notifications: AppNotification[] = [
  { id: 'n1', channel: 'Emergency', title: 'Typhoon Carina Update', message: 'Rides are suspended in coastal areas until 6:00 PM. Stay safe.', audience: 'All users in NCR', status: 'Sent', sentCount: 48200, targetCount: 49100, sentAt: '2026-08-07T07:00:00' },
  { id: 'n2', channel: 'Promotional', title: 'Weekend Ride Discount', message: 'Get 20% off your rides this weekend with code WEEKEND20.', audience: 'All passengers', status: 'Sent', sentCount: 48200, targetCount: 48200, sentAt: '2026-08-06T18:00:00' },
  { id: 'n3', channel: 'Push', title: 'Driver Arrived', message: 'Your driver Dennis A. has arrived at the pickup point.', audience: 'Passenger P-3301', status: 'Sent', sentCount: 1, targetCount: 1, sentAt: '2026-08-07T11:17:00' },
  { id: 'n4', channel: 'Email', title: 'Weekly Earnings Summary', message: 'Your earnings report for the week is ready to view.', audience: 'All drivers', status: 'Sent', sentCount: 31400, targetCount: 32140, sentAt: '2026-08-06T09:00:00' },
  { id: 'n5', channel: 'SMS', title: 'OTP Verification', message: 'Your HatodGo verification code is 482910.', audience: 'Sofia Garcia', status: 'Sent', sentCount: 1, targetCount: 1, sentAt: '2026-08-07T10:20:00' },
  { id: 'n6', channel: 'Scheduled', title: 'Payday Promo Reminder', message: 'Payday is here! Use code PAYDAY25 for 25% off your morning rides.', audience: 'All passengers', status: 'Scheduled', sentCount: 0, targetCount: 48200, scheduledAt: '2026-08-10T06:00:00' },
  { id: 'n7', channel: 'Scheduled', title: 'Driver Safety Bulletin', message: 'Weekend safety reminder: always wear full gear.', audience: 'All drivers', status: 'Scheduled', sentCount: 0, targetCount: 32140, scheduledAt: '2026-08-08T12:00:00' },
  { id: 'n8', channel: 'Push', title: 'New Driver Reward Tier', message: 'Congrats! You reached the Gold tier this month.', audience: 'Top 500 drivers', status: 'Sent', sentCount: 500, targetCount: 500, sentAt: '2026-08-05T10:00:00' },
  { id: 'n9', channel: 'Email', title: 'Suspended Account Notice', message: 'Your account was suspended pending document review.', audience: 'Marlon Cruz', status: 'Sent', sentCount: 1, targetCount: 1, sentAt: '2026-08-04T16:30:00' },
  { id: 'n10', channel: 'Draft', title: 'App v3.2 Release Notes', message: 'New features: dark mode, voice input, and faster payments.', audience: 'All users', status: 'Draft', sentCount: 0, targetCount: 80340 },
];

export function createNotification(payload: AppNotification): AppNotification {
  notifications.unshift(payload);
  return payload;
}
