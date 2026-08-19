import axios from 'axios';
import { apiClient } from './axios';
import { mockApi } from './mock-api';
import { mockData } from './mock-data';
import { useAuthStore } from '@/store/auth-store';
import { ApiError, cloneDeep } from '@/utils/mock';
import type { RegistrationDraft, RegistrationRole } from '@/features/auth/types';
import type { AuthSession, LoginPayload, User } from '@/types/user';
import type { Passenger, PassengerProfilePatch } from '@/types/passenger';
import type { Driver } from '@/types/driver';

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

function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

function sessionUser(): User | undefined {
  return useAuthStore.getState().session?.user;
}

function emailToName(email: string): string {
  const prefix = email.split('@')[0] ?? 'Rider';
  return prefix
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function syntheticPassenger(id: string): Passenger {
  const user = sessionUser();
  const name = user?.name?.trim() || (user?.email ? emailToName(user.email) : 'Rider');
  return {
    id,
    name,
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    photoUrl: user?.photoUrl,
    rating: 0,
    totalBookings: 0,
    totalSpent: 0,
    status: 'Active',
    identityVerified: false,
    preferredPayment: 'Cash',
    homeLocation: '',
    workLocation: '',
    savedPlaces: [],
  };
}

function syntheticDriver(id: string): Driver {
  const user = sessionUser();
  const name = user?.name?.trim() || (user?.email ? emailToName(user.email) : 'Driver');
  const now = new Date().toISOString();
  return {
    id,
    name,
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    photoUrl: user?.photoUrl,
    rating: 0,
    totalTrips: 0,
    totalEarnings: 0,
    totalDistanceKm: 0,
    availability: 'Offline',
    status: 'Active',
    identityVerified: false,
    vehicleType: 'motorcycle',
    joinedAt: now,
    yearsExperience: 0,
    motorcycle: { brand: 'Honda', model: 'TMX 125', plateNumber: 'TBA-0001', color: 'Black', year: new Date().getFullYear() },
    ratingSummary: { average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
    documents: {
      license: { status: 'Pending', note: 'Verification pending' },
      orcr: { status: 'Pending', note: 'Verification pending' },
      nbi: { status: 'Pending', note: 'Verification pending' },
    },
    currentLocation: { latitude: 14.6042, longitude: 121.0212 },
  };
}

/**
 * Real HTTP implementation of the API facade. Auth calls hit the NestJS
 * server; everything else still resolves through the mock so the rest of
 * the app keeps working while the backend is wired up incrementally.
 */
export const httpApi = {
  ...mockApi,

  // Mock data keyed by seed ids (p1-p6, d1-d14) does not cover real server
  // accounts (UUID ids), so lookups fall back to a profile built from the
  // authenticated session. Registered into mockData so downstream screens
  // (profile, saved places, checkout, verification badges) keep working.
  async getPassengerById(id: string): Promise<Passenger> {
    try {
      return await mockApi.getPassengerById(id);
    } catch (error) {
      if (!isNotFound(error)) throw error;
      const passenger = syntheticPassenger(id);
      if (!mockData.passengers.some((p) => p.id === id)) {
        mockData.passengers.unshift(passenger);
      }
      return cloneDeep(passenger);
    }
  },

  async verifyAccount(id: string, patch?: PassengerProfilePatch): Promise<Passenger> {
    try {
      return await mockApi.verifyAccount(id, patch);
    } catch (error) {
      if (!isNotFound(error)) throw error;
      const passenger = syntheticPassenger(id);
      if (patch) Object.assign(passenger, patch);
      passenger.identityVerified = true;
      if (!mockData.passengers.some((p) => p.id === id)) {
        mockData.passengers.unshift(passenger);
      }
      return cloneDeep(passenger);
    }
  },

  async getDriverById(id: string): Promise<Driver> {
    try {
      return await mockApi.getDriverById(id);
    } catch (error) {
      if (!isNotFound(error)) throw error;
      const driver = syntheticDriver(id);
      if (!mockData.drivers.some((d) => d.id === id)) {
        mockData.drivers.unshift(driver);
      }
      return cloneDeep(driver);
    }
  },

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

    if ('firstName' in profile) {
      const name =
        profile.name?.trim() ||
        [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' ');
      const updated: AuthSession = {
        ...session,
        user: { ...session.user, name, phone: profile.phone },
      };
      await this.verifyAccount(session.user.id, {
        firstName: profile.firstName,
        middleName: profile.middleName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender as Passenger['gender'],
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        province: profile.province,
        emergencyName: profile.emergencyName,
        emergencyPhone: profile.emergencyPhone,
        emergencyRelation: profile.emergencyRelation,
      });
      return updated;
    }

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