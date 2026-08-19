export interface LoginFormValues {
  email: string;
  password: string;
}

export type RegistrationRole = 'passenger' | 'driver';

export interface AccountFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormValues {
  name: string;
  phone: string;
}

export type PassengerProfileFormValues = {
  name?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
};

export interface InvitationCodeFormValues {
  invitationCode: string;
}

export interface OtpFormValues {
  otp: string;
}

export interface DocumentUpload {
  key: string;
  label: string;
  description: string;
  fileName: string;
  status: 'idle' | 'uploading' | 'uploaded';
}

export interface RegistrationDraft {
  role: RegistrationRole;
  provider: 'email' | 'google';
  invitationCode: string;
  email: string;
  password: string;
  otpVerified: boolean;
  profile: ProfileFormValues | PassengerProfileFormValues | null;
  documents: DocumentUpload[];
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}