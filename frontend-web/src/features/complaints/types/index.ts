export type ComplaintCategory = 'Payment' | 'Trip' | 'Behavior' | 'Vehicle' | 'Other';
export type ComplaintStatus = 'Open' | 'Under Review' | 'Resolved' | 'Closed';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';

export interface Complaint {
  id: string;
  type: 'Passenger' | 'Driver';
  category: ComplaintCategory;
  subject: string;
  description: string;
  submittedBy: string;
  against: string;
  bookingId?: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  submittedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  requester: string;
  channel: 'Email' | 'Chat' | 'Phone' | 'In-App';
  status: 'Open' | 'Assigned' | 'Waiting' | 'Resolved';
  assignedTo: string;
  updatedAt: string;
}

export interface ComplaintStats {
  open: number;
  underReview: number;
  resolved: number;
  avgResolutionHours: number;
}
