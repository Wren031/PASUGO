import type { GeneralSettings, NotificationSettings, OperatingSettings, PaymentSettings, SecuritySettings } from '../types';

export const generalSettings: GeneralSettings = {
  appName: 'HatodGo',
  tagline: 'Ride smarter, arrive faster',
  supportEmail: 'support@hatodgo.ph',
  supportPhone: '+63 2 8888 1234',
  currency: 'PHP (₱)',
  language: 'English (US)',
  timezone: 'Asia/Manila (UTC+8)',
  appVersion: '2.4.1',
};

export const operatingSettings: OperatingSettings = {
  defaultBookingWindowMin: 30,
  maxConcurrentBookings: 2,
  driverCommissionPercent: 15,
  cancellationWindowMin: 5,
  safetyChecks: true,
  autoAssignDrivers: true,
  weekendDynamicPricing: false,
};

export const paymentSettings: PaymentSettings = {
  gateway: 'GCash',
  payoutSchedule: 'Weekly',
  refundWindowHours: 24,
  autoPayoutEnabled: true,
  cashEnabled: true,
  cardEnabled: true,
};

export const securitySettings: SecuritySettings = {
  twoFactorRequired: true,
  passwordExpiryDays: 90,
  sessionTimeoutMin: 60,
  ipAllowlistEnabled: false,
  ipAllowlist: '203.177.90.0/24',
  maxLoginAttempts: 5,
  forceStrongPasswords: true,
};

export const notificationSettings: NotificationSettings = {
  emailEnabled: true,
  pushEnabled: true,
  smsEnabled: true,
  bookingReminders: true,
  promoEmails: false,
  driverAlerts: true,
};
