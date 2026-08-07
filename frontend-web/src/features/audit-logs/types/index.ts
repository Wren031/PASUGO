export type AuditCategory = 'Admin' | 'Booking' | 'Driver' | 'Payment' | 'Account' | 'System';
export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  target: string;
  category: AuditCategory;
  severity: AuditSeverity;
  ipAddress: string;
  device: string;
}
