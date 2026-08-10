export interface LoginFormValues {
  phone: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'passenger' | 'driver';
}

export interface ForgotPasswordFormValues {
  phone: string;
}
