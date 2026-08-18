import { api } from '@/services';
import type { RegistrationDraft, RegistrationRole } from '../types';
import type { AuthSession, LoginPayload } from '@/types/user';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    return api.login(payload);
  },

  async validateInvitationCode(code: string): Promise<{ code: string; status: string; expiresAt: string }> {
    return api.validateInvitationCode(code);
  },

  async checkEmailAvailable(email: string): Promise<void> {
    return api.checkEmailAvailable(email);
  },

  async requestOtp(role: RegistrationRole, email: string): Promise<{ otp: string }> {
    return api.requestOtp(role, email);
  },

  async verifyOtp(role: RegistrationRole, email: string, otp: string): Promise<void> {
    return api.verifyOtp(role, email, otp);
  },

  async completeRegistration(draft: RegistrationDraft): Promise<AuthSession> {
    return api.completeRegistration(draft);
  },

  async googleSignIn(): Promise<AuthSession> {
    return api.googleSignIn();
  },

  async forgotPassword(phone: string): Promise<void> {
    return api.forgotPassword(phone);
  },

  async getDemoCredentials(): Promise<{ passenger: string; driver: string; password: string }> {
    return api.demoCredentials();
  },
};