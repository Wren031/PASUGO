import { z } from 'zod';
import { REGEX } from '@/constants/mock';
import type { ForgotPasswordFormValues, LoginFormValues, RegisterFormValues } from '../types';

const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^09\d{9}$/, 'Enter a valid 11-digit mobile number starting with 09');

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'Password is required'),
}) satisfies z.ZodType<LoginFormValues>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Please enter your full name'),
    phone: phoneSchema,
    email: z.string().min(1, 'Email is required').regex(REGEX.email, 'Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['passenger', 'driver']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }) satisfies z.ZodType<RegisterFormValues>;

export const forgotPasswordSchema = z.object({
  phone: phoneSchema,
}) satisfies z.ZodType<ForgotPasswordFormValues>;

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, '');
}
