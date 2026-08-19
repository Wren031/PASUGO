import { z } from 'zod';
import { REGEX } from '@/constants/mock';
import type {
  AccountFormValues,
  ForgotPasswordFormValues,
  InvitationCodeFormValues,
  LoginFormValues,
  OtpFormValues,
  ProfileFormValues,
  ResetPasswordFormValues,
} from '../types';

const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^09\d{9}$/, 'Enter a valid 11-digit mobile number starting with 09');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/\d/, 'Include at least one number');

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .regex(REGEX.email, 'Enter a valid email address');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
}) satisfies z.ZodType<LoginFormValues>;

export const invitationCodeSchema = z.object({
  invitationCode: z.string().min(1, 'Invitation code is required'),
}) satisfies z.ZodType<InvitationCodeFormValues>;

export const accountSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }) satisfies z.ZodType<AccountFormValues>;

export const profileSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  phone: phoneSchema,
}) satisfies z.ZodType<ProfileFormValues>;

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
}) satisfies z.ZodType<OtpFormValues>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
}) satisfies z.ZodType<ForgotPasswordFormValues>;

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }) satisfies z.ZodType<ResetPasswordFormValues>;

export type LoginSchema = z.infer<typeof loginSchema>;
export type InvitationCodeSchema = z.infer<typeof invitationCodeSchema>;
export type AccountSchema = z.infer<typeof accountSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, '');
}