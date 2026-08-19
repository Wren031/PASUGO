import axios from 'axios';
import { apiClient } from './axios';
import { mockApi } from './mock-api';
import { useAuthStore } from '@/store/auth-store';
import { ApiError } from '@/utils/mock';
import type { RegistrationDraft, RegistrationRole } from '@/features/auth/types';
import type { AuthSession, LoginPayload, User } from '@/types/user';

interface ServerUser {
  id: string;
  email: string;
  role: User['role'];
  status?: User['status'];
  createdAt: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user?: ServerUser;
}

interface OtpResponse {
  otpExpiresAt?: string;
  devOtp?: string;
}

function toUser(serverUser: ServerUser): User {
  return {
    id: serverUser.id,
    email: serverUser.email,
    role: serverUser.role,
    status: serverUser.status,
    createdAt: serverUser.createdAt,
  };
}

function toSession(data: TokenResponse): AuthSession {
  if (!data.user) {
    throw new ApiError('Server response did not include a user.', 500);
  }
  return { accessToken: data.accessToken, refreshToken: data.refreshToken, user: toUser(data.user) };
}

function toOtp(data: OtpResponse): { otp?: string; otpExpiresAt?: string } {
  return { otp: data.devOtp, otpExpiresAt: data.otpExpiresAt };
}

function toApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const body = error.response?.data as { message?: string | string[] } | undefined;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    return new ApiError(message ?? error.message ?? 'Request failed', status);
  }
  return error instanceof Error ? error : new Error('Request failed');
}

let verifiedSession: AuthSession | null = null;

/**
 * Real HTTP implementation of the API facade. Auth calls hit the NestJS
 * server; everything else still resolves through the mock so the rest of
 * the app keeps working while the backend is wired up incrementally.
 */
export const httpApi = {
  ...mockApi,

  // ------------------------------------------------------------------ auth
  async login(payload: LoginPayload): Promise<AuthSession> {
    try {
      const { data } = await apiClient.post<TokenResponse>('/auth/login', {
        email: payload.email,
        password: payload.password,
      });
      return toSession(data);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async register(role: RegistrationRole, email: string, password: string): Promise<{ otp?: string; otpExpiresAt?: string }> {
    try {
      const { data } = await apiClient.post<OtpResponse>('/auth/register', { email, password, role });
      return toOtp(data);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async requestOtp(role: RegistrationRole, email: string): Promise<{ otp?: string }> {
    try {
      const { data } = await apiClient.post<OtpResponse>('/auth/resend-otp', { email });
      return toOtp(data);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async verifyOtp(role: RegistrationRole, email: string, otp: string): Promise<void> {
    try {
      const { data } = await apiClient.post<TokenResponse>('/auth/verify-otp', { email, otp });
      verifiedSession = toSession(data);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async completeRegistration(draft: RegistrationDraft): Promise<AuthSession> {
    const session = verifiedSession;
    if (!session) {
      throw new ApiError('OTP verification is required before completing registration.', 400);
    }
    verifiedSession = null;
    const profile = draft.profile;
    if (!profile) return session;
    return { ...session, user: { ...session.user, name: profile.name, phone: profile.phone } };
  },

  async forgotPassword(email: string): Promise<{ otp?: string }> {
    try {
      const { data } = await apiClient.post<OtpResponse>('/auth/forgot-password', { email });
      return toOtp(data);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', { email, otp, newPassword });
    } catch (error) {
      throw toApiError(error);
    }
  },

  async logout(): Promise<void> {
    const { session, logout } = useAuthStore.getState();
    if (session?.refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken: session.refreshToken });
      } catch {
        // Revoke locally regardless of the server response.
      }
    }
    logout();
  },

  async validateInvitationCode(code: string): Promise<{ code: string; status: string; expiresAt: string }> {
    try {
      const { data } = await apiClient.post<{ valid: boolean; message: string; code: string }>(
        '/registration-code/validate',
        { code },
      );
      return { code: data.code, status: 'ACTIVE', expiresAt: '' };
    } catch (error) {
      throw toApiError(error);
    }
  },

  async demoCredentials(): Promise<{ passenger: string; driver: string; password: string }> {
    return {
      passenger: 'passenger@hatodgo.ph',
      driver: 'driver@hatodgo.ph',
      password: 'hatodgo123',
    };
  },
};