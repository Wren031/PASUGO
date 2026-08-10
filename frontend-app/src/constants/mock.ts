export const MOCK_CREDENTIALS = {
  passenger: { phone: '0918 876 4321', password: 'hatodgo123', label: 'Passenger - Juan Dela Cruz' },
  driver: { phone: '0917 112 3344', password: 'hatodgo123', label: 'Driver - Arman Castillo' },
  defaultPassword: 'hatodgo123',
} as const;

export const REGEX = {
  phone: /^09\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
