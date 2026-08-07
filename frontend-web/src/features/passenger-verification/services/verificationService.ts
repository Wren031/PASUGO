import { mockDelay } from '@/utils/mock';
import { passengerApplications, updateApplicationStatus } from '../mock/data';
import type { PassengerApplication, VerificationStatus } from '../types';

export const verificationService = {
  async getApplications(): Promise<PassengerApplication[]> {
    await mockDelay(400);
    return passengerApplications.map((application) => ({ ...application, documents: [...application.documents] }));
  },

  async approveApplication(id: string): Promise<PassengerApplication | undefined> {
    await mockDelay(600);
    return updateApplicationStatus(id, 'Approved');
  },

  async rejectApplication(id: string, note: string): Promise<PassengerApplication | undefined> {
    await mockDelay(600);
    return updateApplicationStatus(id, 'Rejected', note);
  },

  async requestResubmission(id: string, note: string): Promise<PassengerApplication | undefined> {
    await mockDelay(600);
    return updateApplicationStatus(id, 'Resubmission', note);
  },

  async getCounts(): Promise<Record<VerificationStatus, number>> {
    await mockDelay(150);
    const counts: Record<VerificationStatus, number> = { Pending: 0, Approved: 0, Rejected: 0, Resubmission: 0 };
    passengerApplications.forEach((application) => {
      counts[application.status] += 1;
    });
    return counts;
  },
};
