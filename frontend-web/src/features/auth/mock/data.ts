import { MOCK_CREDENTIALS } from '@/constants/app';
import type { AuthResponse } from '../types';

export const adminAccount: AuthResponse = {
  token: 'mock-jwt-token-hatodgo-2026',
  user: {
    id: 'adm-001',
    name: 'Alex Montenegro',
    email: MOCK_CREDENTIALS.email,
    role: 'Super Admin',
  },
};

export function isValidCredential(email: string, password: string): boolean {
  return email.toLowerCase() === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password;
}
