import { mockDelay } from '@/utils/mock';
import { generalSettings, notificationSettings, operatingSettings, paymentSettings, securitySettings } from '../mock/data';
import type { GeneralSettings, NotificationSettings, OperatingSettings, PaymentSettings, SecuritySettings } from '../types';

export const settingsService = {
  async getAll(): Promise<{
    general: GeneralSettings;
    operating: OperatingSettings;
    payment: PaymentSettings;
    security: SecuritySettings;
    notifications: NotificationSettings;
  }> {
    await mockDelay(350);
    return {
      general: { ...generalSettings },
      operating: { ...operatingSettings },
      payment: { ...paymentSettings },
      security: { ...securitySettings },
      notifications: { ...notificationSettings },
    };
  },

  async updateGeneral(settings: GeneralSettings): Promise<GeneralSettings> {
    await mockDelay(500);
    Object.assign(generalSettings, settings);
    return { ...generalSettings };
  },

  async updateOperating(settings: OperatingSettings): Promise<OperatingSettings> {
    await mockDelay(500);
    Object.assign(operatingSettings, settings);
    return { ...operatingSettings };
  },

  async updatePayment(settings: PaymentSettings): Promise<PaymentSettings> {
    await mockDelay(500);
    Object.assign(paymentSettings, settings);
    return { ...paymentSettings };
  },

  async updateSecurity(settings: SecuritySettings): Promise<SecuritySettings> {
    await mockDelay(500);
    Object.assign(securitySettings, settings);
    return { ...securitySettings };
  },

  async updateNotifications(settings: NotificationSettings): Promise<NotificationSettings> {
    await mockDelay(500);
    Object.assign(notificationSettings, settings);
    return { ...notificationSettings };
  },
};
