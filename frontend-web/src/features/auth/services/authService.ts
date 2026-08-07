import { mockDelay } from '@/utils/mock';
import { MOCK_CREDENTIALS } from '@/constants/app';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';
import { adminAccount, isValidCredential } from '../mock/data';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await mockDelay(600);
    if (!isValidCredential(payload.email, payload.password)) {
      throw new Error('Invalid email or password. Use the demo credentials shown below.');
    }
    return adminAccount;
  },

  async register(_payload: RegisterPayload): Promise<AuthResponse> {
    await mockDelay(600);
    return {
      token: 'mock-jwt-token-registered-2026',
      user: {
        id: 'usr-new',
        name: _payload.name,
        email: _payload.email,
        role: _payload.role === 'driver' ? 'Driver' : 'Passenger',
      },
    };
  },

  async requestPasswordReset(email: string): Promise<void> {
    await mockDelay(600);
    if (!email.trim()) {
      throw new Error('Email is required.');
    }
  },

  getDemoCredentials() {
    return MOCK_CREDENTIALS;
  },
};
