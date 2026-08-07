export interface GeneralSettings {
  appName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  language: string;
  timezone: string;
  appVersion: string;
}

export interface OperatingSettings {
  defaultBookingWindowMin: number;
  maxConcurrentBookings: number;
  driverCommissionPercent: number;
  cancellationWindowMin: number;
  safetyChecks: boolean;
  autoAssignDrivers: boolean;
  weekendDynamicPricing: boolean;
}

export interface PaymentSettings {
  gateway: 'GCash' | 'PayMongo' | 'PayPal';
  payoutSchedule: 'Daily' | 'Weekly' | 'Bi-weekly';
  refundWindowHours: number;
  autoPayoutEnabled: boolean;
  cashEnabled: boolean;
  cardEnabled: boolean;
}

export interface SecuritySettings {
  twoFactorRequired: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMin: number;
  ipAllowlistEnabled: boolean;
  ipAllowlist: string;
  maxLoginAttempts: number;
  forceStrongPasswords: boolean;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  bookingReminders: boolean;
  promoEmails: boolean;
  driverAlerts: boolean;
}
