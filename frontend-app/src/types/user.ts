import type { AccountStatus, Role } from './common';

export interface User {
  id: string;
  role: Role;
  email: string;
  name?: string;
  phone?: string;
  photoUrl?: string;
  status?: AccountStatus;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}