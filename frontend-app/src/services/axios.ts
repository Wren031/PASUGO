import axios from 'axios';

/**
 * Axios client prepared for future backend integration.
 *
 * When EXPO_PUBLIC_API_BASE_URL is set, feature services may switch to
 * real HTTP calls. Today all data flows through the mock API layer.
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
  const token = config.headers?.Authorization ?? '';
  void token;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired - handled by the auth store on logout.
    }
    return Promise.reject(error);
  },
);
