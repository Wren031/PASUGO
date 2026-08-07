import type { Complaint, ComplaintStats, SupportTicket } from '../types';

export const complaintStats: ComplaintStats = {
  open: 4,
  underReview: 7,
  resolved: 96,
  avgResolutionHours: 18,
};

export const complaints: Complaint[] = [
  { id: 'C-112', type: 'Passenger', category: 'Trip', subject: 'Driver took a longer route', description: 'Driver deviated from the suggested route adding ₱35 to the fare without informing me.', submittedBy: 'Sofia Garcia', against: 'Victor Suarez', bookingId: 'B-20835', priority: 'High', status: 'Under Review', submittedAt: '2026-08-07T08:58:00' },
  { id: 'C-111', type: 'Driver', category: 'Behavior', subject: 'Passenger refused to wear helmet', description: 'Passenger insisted on riding without a helmet and became hostile when I declined.', submittedBy: 'Ronald Fernandez', against: 'Anonymous passenger', priority: 'High', status: 'Open', submittedAt: '2026-08-07T07:40:00' },
  { id: 'C-110', type: 'Passenger', category: 'Payment', subject: 'Double charge on GCash', description: 'My GCash was debited twice for the same ride. Booking B-20790.', submittedBy: 'Sofia Garcia', against: 'HatodGo Payments', bookingId: 'B-20790', priority: 'High', status: 'Resolved', submittedAt: '2026-08-06T09:30:00', resolvedAt: '2026-08-06T15:20:00', resolution: 'Duplicate charge reversed. Refund issued to GCash.' },
  { id: 'C-109', type: 'Passenger', category: 'Vehicle', subject: 'Motorcycle rear brake issues', description: 'Driver\'s motorcycle had a noisy rear brake. Concerned about safety on EDSA.', submittedBy: 'Miguel Tan', against: 'Noel Antonio', bookingId: 'B-20819', priority: 'Medium', status: 'Resolved', submittedAt: '2026-08-06T07:12:00', resolvedAt: '2026-08-06T11:05:00', resolution: 'Vehicle inspected. Brake pads replaced same day.' },
  { id: 'C-108', type: 'Passenger', category: 'Trip', subject: 'Driver never arrived', description: 'Waited 25 minutes at pickup and the driver cancelled without notice.', submittedBy: 'Andrea Lim', against: 'Unassigned', bookingId: 'B-20760', priority: 'High', status: 'Under Review', submittedAt: '2026-08-05T18:45:00' },
  { id: 'C-107', type: 'Driver', category: 'Payment', subject: 'Cash fare not received', description: 'Passenger claimed to have paid via wallet but no payment was received.', submittedBy: 'Mark Villanueva', against: 'Passenger P-8821', bookingId: 'B-20750', priority: 'Medium', status: 'Under Review', submittedAt: '2026-08-05T09:20:00' },
  { id: 'C-106', type: 'Passenger', category: 'Other', subject: 'Lost item on ride', description: 'Left my power bank on the motorcycle. Driver already completed another trip.', submittedBy: 'Hannah Reyes', against: 'Victor Suarez', bookingId: 'B-20825', priority: 'Low', status: 'Open', submittedAt: '2026-08-07T10:05:00' },
  { id: 'C-105', type: 'Passenger', category: 'Behavior', subject: 'Unprofessional behavior', description: 'Driver used profanity during a traffic dispute on Commonwealth.', submittedBy: 'Christian Ramos', against: 'Marlon Cruz', bookingId: 'B-20801', priority: 'Medium', status: 'Resolved', submittedAt: '2026-08-05T19:10:00', resolvedAt: '2026-08-06T10:00:00', resolution: 'Driver issued a written warning and completed a professionalism module.' },
];

export const supportTickets: SupportTicket[] = [
  { id: 'ST-501', subject: 'Cannot log in to passenger app', requester: 'Angela Reyes', channel: 'In-App', status: 'Assigned', assignedTo: 'Elaine Torres', updatedAt: '2026-08-07T10:30:00' },
  { id: 'ST-500', subject: 'Driver payout delay', requester: 'Arman Castillo', channel: 'Chat', status: 'Open', assignedTo: 'Carlo Dizon', updatedAt: '2026-08-07T09:15:00' },
  { id: 'ST-499', subject: 'Promo code not applying', requester: 'Miguel Tan', channel: 'Email', status: 'Waiting', assignedTo: 'Grace Uy', updatedAt: '2026-08-06T17:40:00' },
  { id: 'ST-498', subject: 'Change of registered phone number', requester: 'Juan Dela Cruz', channel: 'Phone', status: 'Resolved', assignedTo: 'Elaine Torres', updatedAt: '2026-08-06T14:05:00' },
  { id: 'ST-497', subject: 'Refund status inquiry', requester: 'Sofia Garcia', channel: 'In-App', status: 'Resolved', assignedTo: 'Grace Uy', updatedAt: '2026-08-06T11:22:00' },
];

export function resolveComplaint(id: string, resolution: string): Complaint | undefined {
  const complaint = complaints.find((item) => item.id === id);
  if (complaint) {
    complaint.status = 'Resolved';
    complaint.resolution = resolution;
    complaint.resolvedAt = new Date().toISOString();
  }
  return complaint ? { ...complaint } : undefined;
}
