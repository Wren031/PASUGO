import type { Role } from './common';

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface LoginPayload {
  phone: string;
  password: string;
}
