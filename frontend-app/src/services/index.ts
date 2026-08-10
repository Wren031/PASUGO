import { mockApi } from './mock-api';
import { API_BASE_URL } from './axios';

/**
 * API facade.
 *
 * Today every call resolves through the in-memory mock API so the app can
 * run without a backend. When EXPO_PUBLIC_API_BASE_URL is provided, swap
 * the functions below for real HTTP implementations without touching the
 * feature layers.
 */
export const api = mockApi;

export const isMockMode = API_BASE_URL === '';

export { mockApi };
