import { z } from 'zod';
import type { PassengerGender } from '@/types/passenger';

export const PASSENGER_GENDERS: PassengerGender[] = [
  'Male',
  'Female',
  'Other',
  'PreferNotToSay',
];

const phoneSchema = z
  .string()
  .regex(/^09\d{9}$/, 'Enter a valid 11-digit mobile number starting with 09');

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter your birth date as YYYY-MM-DD')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00`);
    return !Number.isNaN(date.getTime()) && date <= new Date();
  }, 'Enter a valid past date');

export const passengerProfileSchema = z.object({
  firstName: z.string().min(2, 'Please enter your first name'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Please enter your last name'),
  dateOfBirth: dateSchema,
  gender: z
    .string()
    .refine((value) => PASSENGER_GENDERS.includes(value as PassengerGender), {
      message: 'Please choose your gender',
    }),
  phone: phoneSchema,
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyRelation: z.string().optional(),
});

export type PassengerProfileFormValues = z.infer<typeof passengerProfileSchema>;