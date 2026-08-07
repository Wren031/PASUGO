export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Resubmission';

export interface VerificationDocument {
  id: string;
  name: string;
  label: string;
  status: VerificationStatus;
  note?: string;
}

export interface PassengerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: string;
  status: VerificationStatus;
  city: string;
  documents: VerificationDocument[];
  tripsCount: number;
  rejectionReason?: string;
}
