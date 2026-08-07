import type { PassengerApplication } from '../types';

export const passengerApplications: PassengerApplication[] = [
  {
    id: 'papp-201',
    name: 'Sofia Garcia',
    email: 'sofia.garcia@gmail.com',
    phone: '0917 123 4567',
    appliedAt: '2026-08-07T09:30:00',
    status: 'Pending',
    city: 'Quezon City',
    tripsCount: 148,
    documents: [
      { id: 'pdoc-1', name: 'id_front.jpg', label: 'Government ID (Front)', status: 'Approved', note: 'UMID · valid until 2031' },
      { id: 'pdoc-2', name: 'id_back.jpg', label: 'Government ID (Back)', status: 'Pending' },
      { id: 'pdoc-3', name: 'selfie_with_id.jpg', label: 'Selfie Holding ID', status: 'Pending' },
      { id: 'pdoc-4', name: 'billing_statement.pdf', label: 'Proof of Address', status: 'Pending' },
    ],
  },
  {
    id: 'papp-202',
    name: 'Miguel Tan',
    email: 'miguel.tan@gmail.com',
    phone: '0918 222 3344',
    appliedAt: '2026-08-06T15:40:00',
    status: 'Pending',
    city: 'Makati',
    tripsCount: 87,
    documents: [
      { id: 'pdoc-5', name: 'id_front.jpg', label: 'Government ID (Front)', status: 'Approved' },
      { id: 'pdoc-6', name: 'id_back.jpg', label: 'Government ID (Back)', status: 'Pending' },
      { id: 'pdoc-7', name: 'selfie_with_id.jpg', label: 'Selfie Holding ID', status: 'Pending' },
      { id: 'pdoc-8', name: 'billing_statement.pdf', label: 'Proof of Address', status: 'Pending' },
    ],
  },
  {
    id: 'papp-203',
    name: 'Anna Reyes',
    email: 'anna.reyes@gmail.com',
    phone: '0915 777 8899',
    appliedAt: '2026-08-05T11:10:00',
    status: 'Resubmission',
    city: 'Taguig',
    tripsCount: 231,
    documents: [
      { id: 'pdoc-9', name: 'id_front.jpg', label: 'Government ID (Front)', status: 'Approved' },
      { id: 'pdoc-10', name: 'id_back.jpg', label: 'Government ID (Back)', status: 'Approved' },
      { id: 'pdoc-11', name: 'selfie_with_id.jpg', label: 'Selfie Holding ID', status: 'Rejected', note: 'Face is not clearly visible — please retake in good lighting' },
      { id: 'pdoc-12', name: 'billing_statement.pdf', label: 'Proof of Address', status: 'Resubmission', note: 'Statement is older than 3 months' },
    ],
  },
  {
    id: 'papp-204',
    name: 'Marco Villanueva',
    email: 'marco.villanueva@gmail.com',
    phone: '0919 333 5566',
    appliedAt: '2026-08-04T13:25:00',
    status: 'Pending',
    city: 'Pasig',
    tripsCount: 12,
    documents: [
      { id: 'pdoc-13', name: 'id_front.jpg', label: 'Government ID (Front)', status: 'Pending' },
      { id: 'pdoc-14', name: 'id_back.jpg', label: 'Government ID (Back)', status: 'Pending' },
      { id: 'pdoc-15', name: 'selfie_with_id.jpg', label: 'Selfie Holding ID', status: 'Pending' },
      { id: 'pdoc-16', name: 'billing_statement.pdf', label: 'Proof of Address', status: 'Pending' },
    ],
  },
  {
    id: 'papp-205',
    name: 'Jasmine Cruz',
    email: 'jasmine.cruz@gmail.com',
    phone: '0922 111 2233',
    appliedAt: '2026-08-02T10:05:00',
    status: 'Approved',
    city: 'Mandaluyong',
    tripsCount: 64,
    documents: [
      { id: 'pdoc-17', name: 'id_front.jpg', label: 'Government ID (Front)', status: 'Approved' },
      { id: 'pdoc-18', name: 'id_back.jpg', label: 'Government ID (Back)', status: 'Approved' },
      { id: 'pdoc-19', name: 'selfie_with_id.jpg', label: 'Selfie Holding ID', status: 'Approved' },
      { id: 'pdoc-20', name: 'billing_statement.pdf', label: 'Proof of Address', status: 'Approved' },
    ],
  },
  {
    id: 'papp-206',
    name: 'Nathan Ocampo',
    email: 'nathan.ocampo@gmail.com',
    phone: '0920 445 6677',
    appliedAt: '2026-07-31T16:50:00',
    status: 'Rejected',
    city: 'Pasay',
    tripsCount: 3,
    rejectionReason: 'Selfie does not match the submitted government ID. Reapplication allowed with corrected documents.',
    documents: [
      { id: 'pdoc-21', name: 'id_front.jpg', label: 'Government ID (Front)', status: 'Approved' },
      { id: 'pdoc-22', name: 'id_back.jpg', label: 'Government ID (Back)', status: 'Approved' },
      { id: 'pdoc-23', name: 'selfie_with_id.jpg', label: 'Selfie Holding ID', status: 'Rejected', note: 'Face does not match the ID photo' },
      { id: 'pdoc-24', name: 'billing_statement.pdf', label: 'Proof of Address', status: 'Approved' },
    ],
  },
];

export function updateApplicationStatus(id: string, status: PassengerApplication['status'], note?: string): PassengerApplication | undefined {
  const application = passengerApplications.find((item) => item.id === id);
  if (application) {
    application.status = status;
    if (note) {
      application.rejectionReason = note;
    }
  }
  return application ? { ...application } : undefined;
}
