export type AdminRole = 'Super Admin' | 'Operations' | 'Finance' | 'Support' | 'Viewer';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'Active' | 'Suspended';
  lastLogin: string;
  createdAt: string;
}

export interface CreateAdminInput {
  name: string;
  email: string;
  role: AdminRole;
}

export interface RolePermission {
  role: AdminRole;
  color: 'orange' | 'blue' | 'green' | 'purple' | 'slate';
  permissions: string[];
}
