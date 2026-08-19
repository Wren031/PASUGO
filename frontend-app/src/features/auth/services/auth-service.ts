import { api } from '@/services';
import type { RegistrationDraft, RegistrationRole } from '../types';
import type { AuthSession, LoginPayload } from '@/types/user';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    return api.login(payload);
  },

  async register(role: RegistrationRole, email: string, password: string): Promise<{ otp?: string }> {
    return api.register(role, email, password);
  },

  async validateInvitationCode(code: string): Promise<{ code: string; status: string; expiresAt: string }> {
    return api.validateInvitationCode(code);
  },

  async requestOtp(role: RegistrationRole, email: string): Promise<{ otp?: string }> {
    return api.requestOtp(role, email);
  },

  async verifyOtp(role: RegistrationRole, email: string, otp: string): Promise<void> {
    return api.verifyOtp(role, email, otp);
  },

  async completeRegistration(draft: RegistrationDraft): Promise<AuthSession> {
    return api.completeRegistration(draft);
  },

  async forgotPassword(email: string): Promise<{ otp?: string }> {
    return api.forgotPassword(email);
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    return api.resetPassword(email, otp, newPassword);
  },

  async logout(): Promise<void> {
    return api.logout();
  },

  async getDemoCredentials(): Promise<{ passenger: string; driver: string; password: string }> {
    return api.demoCredentials();
  },
};