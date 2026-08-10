import { api } from '@/services';
import type { AuthSession, LoginPayload, RegisterPayload } from '@/types/user';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    return api.login(payload);
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    return api.register(payload);
  },

  async forgotPassword(phone: string): Promise<void> {
    return api.forgotPassword(phone);
  },

  async getDemoCredentials(): Promise<{ passenger: string; driver: string; password: string }> {
    return api.demoCredentials();
  },
};
