export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Resubmission';

export interface VerificationDocument {
  id: string;
  name: string;
  label: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Resubmission';
  note?: string;
}

export interface DriverApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: string;
  status: ApplicationStatus;
  motorcycle: string;
  plateNumber: string;
  city: string;
  documents: VerificationDocument[];
  vehiclePhotos: number;
  reviewsCount: number;
  rejectionReason?: string;
}
