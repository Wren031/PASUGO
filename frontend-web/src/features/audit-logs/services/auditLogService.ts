import { mockDelay } from '@/utils/mock';
import { auditLogs } from '../mock/data';
import type { AuditCategory, AuditLog } from '../types';

export const auditLogService = {
  async getLogs(): Promise<AuditLog[]> {
    await mockDelay(400);
    return [...auditLogs];
  },

  async getCategories(): Promise<AuditCategory[]> {
    await mockDelay(150);
    return ['Admin', 'Booking', 'Driver', 'Payment', 'Account', 'System'];
  },
};
