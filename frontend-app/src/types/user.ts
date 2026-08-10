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

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: Role;
}
