import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth-store';

/**
 * Axios client for the HatodGo API.
 *
 * Attaches the stored access token to every request and, on a 401, tries to
 * refresh the session once before failing. Requires EXPO_PUBLIC_API_BASE_URL
 * to be set (see .env); when unset the app runs against the mock API.
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().session?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { session, login, logout } = useAuthStore.getState();
  if (!session?.refreshToken) return null;

  try {
    const { data } = await refreshClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken: session.refreshToken },
    );
    login({ ...session, accessToken: data.accessToken, refreshToken: data.refreshToken });
    return data.accessToken;
  } catch {
    logout();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && config && !config._retry) {
      config._retry = true;
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const accessToken = await refreshPromise;
      refreshPromise = null;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(config);
      }
    }

    return Promise.reject(error);
  },
);