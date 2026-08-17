import { AccountStatus } from '../enums/account-status.enum';
import { UserRole } from '../enums/user-role.enum';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: Date;
}