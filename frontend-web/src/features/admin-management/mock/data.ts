import type { AdminAccount, AdminRole, RolePermission } from '../types';

export const adminAccounts: AdminAccount[] = [
  { id: 'adm-001', name: 'Alex Montenegro', email: 'alex@hatodgo.ph', role: 'Super Admin', status: 'Active', lastLogin: '2026-08-07 08:42', createdAt: '2025-01-10' },
  { id: 'adm-002', name: 'Maria Santos', email: 'maria@hatodgo.ph', role: 'Operations', status: 'Active', lastLogin: '2026-08-07 07:15', createdAt: '2025-02-03' },
  { id: 'adm-003', name: 'Juan Dela Cruz', email: 'juan@hatodgo.ph', role: 'Operations', status: 'Active', lastLogin: '2026-08-06 22:04', createdAt: '2025-03-18' },
  { id: 'adm-004', name: 'Carla Reyes', email: 'carla@hatodgo.ph', role: 'Finance', status: 'Active', lastLogin: '2026-08-06 17:30', createdAt: '2025-05-22' },
  { id: 'adm-005', name: 'Paolo Garcia', email: 'paolo@hatodgo.ph', role: 'Support', status: 'Active', lastLogin: '2026-08-07 09:01', createdAt: '2025-06-14' },
  { id: 'adm-006', name: 'Katrina Lopez', email: 'katrina@hatodgo.ph', role: 'Viewer', status: 'Active', lastLogin: '2026-08-02 11:48', createdAt: '2025-08-30' },
  { id: 'adm-007', name: 'Miguel Torres', email: 'miguel@hatodgo.ph', role: 'Support', status: 'Suspended', lastLogin: '2026-05-19 14:22', createdAt: '2025-07-05' },
  { id: 'adm-008', name: 'Andrea Flores', email: 'andrea@hatodgo.ph', role: 'Finance', status: 'Active', lastLogin: '2026-08-05 16:09', createdAt: '2025-10-11' },
];

export const rolePermissions: RolePermission[] = [
  {
    role: 'Super Admin',
    color: 'orange',
    permissions: ['Full access to all modules', 'Manage admin accounts', 'Configure fares & settings', 'Approve driver applications'],
  },
  {
    role: 'Operations',
    color: 'blue',
    permissions: ['Manage bookings & live trips', 'Handle driver verification', 'Resolve complaints', 'View reports'],
  },
  {
    role: 'Finance',
    color: 'green',
    permissions: ['View earnings & payouts', 'Manage refunds', 'Export financial reports', 'No access to bookings'],
  },
  {
    role: 'Support',
    color: 'purple',
    permissions: ['Answer complaints & tickets', 'View passenger & driver profiles', 'Send notifications', 'No payout access'],
  },
  {
    role: 'Viewer',
    color: 'slate',
    permissions: ['Read-only dashboard access', 'View reports & analytics', 'No actions or edits', 'No payout access'],
  },
];

export const roleTone: Record<AdminRole, 'orange' | 'blue' | 'green' | 'purple' | 'slate'> = {
  'Super Admin': 'orange',
  Operations: 'blue',
  Finance: 'green',
  Support: 'purple',
  Viewer: 'slate',
};
