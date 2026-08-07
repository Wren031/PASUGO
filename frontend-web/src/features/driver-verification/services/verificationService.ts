import { mockDelay } from '@/utils/mock';
import type { DriverApplication } from '../types';
import { driverApplications, updateApplicationStatus } from '../mock/data';

export const verificationService = {
  async getApplications(): Promise<DriverApplication[]> {
    await mockDelay(400);
    return driverApplications.map((item) => ({ ...item, documents: [...item.documents] }));
  },

  async approveApplication(id: string): Promise<DriverApplication | undefined> {
    await mockDelay(500);
    const updated = updateApplicationStatus(id, 'Approved');
    return updated ? { ...updated } : undefined;
  },

  async rejectApplication(id: string, reason: string): Promise<DriverApplication | undefined> {
    await mockDelay(500);
    const updated = updateApplicationStatus(id, 'Rejected', reason);
    return updated ? { ...updated } : undefined;
  },

  async requestResubmission(id: string, note: string): Promise<DriverApplication | undefined> {
    await mockDelay(500);
    const updated = updateApplicationStatus(id, 'Resubmission', note);
    return updated ? { ...updated } : undefined;
  },
};
