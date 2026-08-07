import type { AuditLog } from '../types';

export const auditLogs: AuditLog[] = [
  { id: 'log-001', timestamp: '2026-08-07 09:12', admin: 'Alex Montenegro', action: 'Approved driver application', target: 'DRV-1098 · R. Villanueva', category: 'Driver', severity: 'info', ipAddress: '203.177.92.14', device: 'Chrome · Windows' },
  { id: 'log-002', timestamp: '2026-08-07 08:58', admin: 'Paolo Garcia', action: 'Resolved complaint', target: 'CPL-4521', category: 'Account', severity: 'info', ipAddress: '203.177.90.221', device: 'Chrome · Mac' },
  { id: 'log-003', timestamp: '2026-08-07 08:41', admin: 'Alex Montenegro', action: 'Signed in', target: 'Dashboard', category: 'Admin', severity: 'info', ipAddress: '203.177.92.14', device: 'Chrome · Windows' },
  { id: 'log-004', timestamp: '2026-08-07 07:15', admin: 'Maria Santos', action: 'Signed in', target: 'Dashboard', category: 'Admin', severity: 'info', ipAddress: '112.198.77.5', device: 'Edge · Windows' },
  { id: 'log-005', timestamp: '2026-08-06 23:04', admin: 'System', action: 'Issued refund', target: 'PYT-7712 · ₱160.00', category: 'Payment', severity: 'info', ipAddress: 'Internal', device: 'System' },
  { id: 'log-006', timestamp: '2026-08-06 22:12', admin: 'Juan Dela Cruz', action: 'Rejected driver document', target: 'DRV-1054 · LTO License', category: 'Driver', severity: 'warning', ipAddress: '203.177.95.40', device: 'Firefox · Windows' },
  { id: 'log-007', timestamp: '2026-08-06 20:33', admin: 'Maria Santos', action: 'Canceled booking', target: 'BKG-8912', category: 'Booking', severity: 'warning', ipAddress: '112.198.77.5', device: 'Edge · Windows' },
  { id: 'log-008', timestamp: '2026-08-06 19:47', admin: 'Alex Montenegro', action: 'Updated fare settings', target: 'Base fare → ₱40', category: 'System', severity: 'warning', ipAddress: '203.177.92.14', device: 'Chrome · Windows' },
  { id: 'log-009', timestamp: '2026-08-06 18:25', admin: 'System', action: 'Payout batch sent', target: '538 drivers · ₱1,892,400', category: 'Payment', severity: 'info', ipAddress: 'Internal', device: 'System' },
  { id: 'log-010', timestamp: '2026-08-06 17:30', admin: 'Carla Reyes', action: 'Signed in', target: 'Dashboard', category: 'Admin', severity: 'info', ipAddress: '203.177.88.9', device: 'Safari · Mac' },
  { id: 'log-011', timestamp: '2026-08-06 16:02', admin: 'Juan Dela Cruz', action: 'Suspended driver account', target: 'DRV-0887 · T. Ramos', category: 'Driver', severity: 'critical', ipAddress: '203.177.95.40', device: 'Firefox · Windows' },
  { id: 'log-012', timestamp: '2026-08-06 14:44', admin: 'System', action: 'Failed login attempt', target: 'admin@hatodgo.ph', category: 'Admin', severity: 'warning', ipAddress: '45.88.12.4', device: 'Unknown' },
  { id: 'log-013', timestamp: '2026-08-06 13:10', admin: 'Paolo Garcia', action: 'Sent push notification', target: 'Weather advisory · 12,480 riders', category: 'Account', severity: 'info', ipAddress: '203.177.90.221', device: 'Chrome · Mac' },
  { id: 'log-014', timestamp: '2026-08-06 11:56', admin: 'Carla Reyes', action: 'Exported financial report', target: 'weekly-payouts.csv', category: 'Payment', severity: 'info', ipAddress: '203.177.88.9', device: 'Safari · Mac' },
  { id: 'log-015', timestamp: '2026-08-06 10:22', admin: 'Alex Montenegro', action: 'Created admin account', target: 'andrea@hatodgo.ph · Finance', category: 'System', severity: 'warning', ipAddress: '203.177.92.14', device: 'Chrome · Windows' },
  { id: 'log-016', timestamp: '2026-08-06 09:05', admin: 'System', action: 'Refund rejected', target: 'PYT-7645 · past 24h window', category: 'Payment', severity: 'warning', ipAddress: 'Internal', device: 'System' },
  { id: 'log-017', timestamp: '2026-08-05 21:48', admin: 'Maria Santos', action: 'Escalated complaint', target: 'CPL-4489 → Operations', category: 'Account', severity: 'warning', ipAddress: '112.198.77.5', device: 'Edge · Windows' },
  { id: 'log-018', timestamp: '2026-08-05 20:11', admin: 'Juan Dela Cruz', action: 'Reactivated driver account', target: 'DRV-0921 · K. Ancheta', category: 'Driver', severity: 'info', ipAddress: '203.177.95.40', device: 'Firefox · Windows' },
];
