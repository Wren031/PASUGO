import { mockDelay } from '@/utils/mock';
import { adminAccounts } from '../mock/data';
import type { AdminAccount, AdminRole, CreateAdminInput } from '../types';

export const adminService = {
  async getAdmins(): Promise<AdminAccount[]> {
    await mockDelay(350);
    return [...adminAccounts];
  },

  async createAdmin(input: CreateAdminInput): Promise<AdminAccount> {
    await mockDelay(600);
    const account: AdminAccount = {
      id: `adm-${String(adminAccounts.length + 1).padStart(3, '0')}`,
      name: input.name,
      email: input.email,
      role: input.role,
      status: 'Active',
      lastLogin: '—',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    adminAccounts.unshift(account);
    return account;
  },

  async updateRole(id: string, role: AdminRole): Promise<AdminAccount | undefined> {
    await mockDelay(400);
    const account = adminAccounts.find((admin) => admin.id === id);
    if (account) account.role = role;
    return account;
  },

  async toggleStatus(id: string): Promise<AdminAccount | undefined> {
    await mockDelay(400);
    const account = adminAccounts.find((admin) => admin.id === id);
    if (account) account.status = account.status === 'Active' ? 'Suspended' : 'Active';
    return account;
  },
};
