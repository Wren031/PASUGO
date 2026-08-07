import type { DriverApplication } from '../types';

export const driverApplications: DriverApplication[] = [
  {
    id: 'app-101',
    name: 'Jerome Aguirre',
    email: 'jerome.aguirre@gmail.com',
    phone: '0917 445 7788',
    appliedAt: '2026-08-06T14:20:00',
    status: 'Pending',
    motorcycle: 'Yamaha Mio i125',
    plateNumber: 'KLM-4455',
    city: 'Quezon City',
    vehiclePhotos: 6,
    reviewsCount: 2,
    documents: [
      { id: 'doc-1', name: 'license_front.jpg', label: "Driver's License (Front)", status: 'Approved', note: 'Valid until Aug 2029' },
      { id: 'doc-2', name: 'license_back.jpg', label: "Driver's License (Back)", status: 'Approved' },
      { id: 'doc-3', name: 'orcr.pdf', label: 'OR/CR Certificate', status: 'Pending' },
      { id: 'doc-4', name: 'nbi_clearance.pdf', label: 'NBI Clearance', status: 'Pending' },
    ],
  },
  {
    id: 'app-102',
    name: 'Ryan Salazar',
    email: 'ryan.salazar@gmail.com',
    phone: '0918 667 2233',
    appliedAt: '2026-08-06T09:05:00',
    status: 'Pending',
    motorcycle: 'Honda Beat 110',
    plateNumber: 'NOP-7788',
    city: 'Pasig',
    vehiclePhotos: 4,
    reviewsCount: 1,
    documents: [
      { id: 'doc-5', name: 'license_front.jpg', label: "Driver's License (Front)", status: 'Approved' },
      { id: 'doc-6', name: 'license_back.jpg', label: "Driver's License (Back)", status: 'Pending' },
      { id: 'doc-7', name: 'orcr.pdf', label: 'OR/CR Certificate', status: 'Pending' },
      { id: 'doc-8', name: 'nbi_clearance.pdf', label: 'NBI Clearance', status: 'Pending' },
    ],
  },
  {
    id: 'app-103',
    name: 'Edwin Torres',
    email: 'edwin.torres@gmail.com',
    phone: '0920 334 5566',
    appliedAt: '2026-08-05T17:45:00',
    status: 'Resubmission',
    motorcycle: 'Suzuki Skydrive',
    plateNumber: 'PQR-9900',
    city: 'Makati',
    vehiclePhotos: 3,
    reviewsCount: 0,
    documents: [
      { id: 'doc-9', name: 'license_front.jpg', label: "Driver's License (Front)", status: 'Approved' },
      { id: 'doc-10', name: 'license_back.jpg', label: "Driver's License (Back)", status: 'Approved' },
      { id: 'doc-11', name: 'orcr.pdf', label: 'OR/CR Certificate', status: 'Rejected', note: 'Photo is blurred — please resubmit a clear copy' },
      { id: 'doc-12', name: 'nbi_clearance.pdf', label: 'NBI Clearance', status: 'Resubmission', note: 'Clearance is more than 6 months old' },
    ],
  },
  {
    id: 'app-104',
    name: 'Cristine Lim',
    email: 'cristine.lim@gmail.com',
    phone: '0915 889 1122',
    appliedAt: '2026-08-04T11:30:00',
    status: 'Pending',
    motorcycle: 'Honda Click 125',
    plateNumber: 'STU-1122',
    city: 'Taguig',
    vehiclePhotos: 5,
    reviewsCount: 0,
    documents: [
      { id: 'doc-13', name: 'license_front.jpg', label: "Driver's License (Front)", status: 'Pending' },
      { id: 'doc-14', name: 'license_back.jpg', label: "Driver's License (Back)", status: 'Pending' },
      { id: 'doc-15', name: 'orcr.pdf', label: 'OR/CR Certificate', status: 'Pending' },
      { id: 'doc-16', name: 'nbi_clearance.pdf', label: 'NBI Clearance', status: 'Pending' },
    ],
  },
  {
    id: 'app-105',
    name: 'Karlo Bautista',
    email: 'karlo.bautista@gmail.com',
    phone: '0919 112 3344',
    appliedAt: '2026-08-03T08:50:00',
    status: 'Pending',
    motorcycle: 'Yamaha NMAX',
    plateNumber: 'VWX-3344',
    city: 'Mandaluyong',
    vehiclePhotos: 6,
    reviewsCount: 1,
    documents: [
      { id: 'doc-17', name: 'license_front.jpg', label: "Driver's License (Front)", status: 'Approved' },
      { id: 'doc-18', name: 'license_back.jpg', label: "Driver's License (Back)", status: 'Approved' },
      { id: 'doc-19', name: 'orcr.pdf', label: 'OR/CR Certificate', status: 'Pending' },
      { id: 'doc-20', name: 'nbi_clearance.pdf', label: 'NBI Clearance', status: 'Pending' },
    ],
  },
  {
    id: 'app-106',
    name: 'Nica Dela Rosa',
    email: 'nica.delarosa@gmail.com',
    phone: '0922 556 7788',
    appliedAt: '2026-08-02T16:15:00',
    status: 'Rejected',
    motorcycle: 'Honda TMX 125',
    plateNumber: 'YZA-5566',
    city: 'Pasay',
    vehiclePhotos: 2,
    reviewsCount: 0,
    rejectionReason: 'NBI clearance shows a pending case. Reapplication allowed after resolution.',
    documents: [
      { id: 'doc-21', name: 'license_front.jpg', label: "Driver's License (Front)", status: 'Approved' },
      { id: 'doc-22', name: 'license_back.jpg', label: "Driver's License (Back)", status: 'Approved' },
      { id: 'doc-23', name: 'orcr.pdf', label: 'OR/CR Certificate', status: 'Approved' },
      { id: 'doc-24', name: 'nbi_clearance.pdf', label: 'NBI Clearance', status: 'Rejected', note: 'Pending case flagged during background check' },
    ],
  },
];

export function updateApplicationStatus(id: string, status: DriverApplication['status'], note?: string): DriverApplication | undefined {
  const application = driverApplications.find((item) => item.id === id);
  if (application) {
    application.status = status;
    if (note) {
      application.rejectionReason = note;
    }
  }
  return application ? { ...application } : undefined;
}
