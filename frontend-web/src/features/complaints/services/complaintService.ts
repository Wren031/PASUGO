import { mockDelay } from '@/utils/mock';
import type { Complaint, ComplaintStats, SupportTicket } from '../types';
import { complaints, complaintStats, resolveComplaint, supportTickets } from '../mock/data';

export const complaintService = {
  async getStats(): Promise<ComplaintStats> {
    await mockDelay(300);
    return { ...complaintStats };
  },
  async getComplaints(): Promise<Complaint[]> {
    await mockDelay(400);
    return complaints.map((item) => ({ ...item }));
  },
  async getSupportTickets(): Promise<SupportTicket[]> {
    await mockDelay(300);
    return supportTickets.map((item) => ({ ...item }));
  },
  async resolve(id: string, resolution: string): Promise<Complaint | undefined> {
    await mockDelay(400);
    const updated = resolveComplaint(id, resolution);
    return updated ? { ...updated } : undefined;
  },
};
