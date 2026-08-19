import { httpApi } from './http-api';

/**
 * API facade.
 *
 * Auth always talks to the real server via httpApi; the remaining feature
 * methods (bookings, payments, ...) still resolve through the in-memory
 * mock until they are wired up to the backend incrementally.
 */
export const api = httpApi;

export { httpApi };