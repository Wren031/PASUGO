import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'A valid email is required' })
  email: string | undefined;

  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must contain only digits' })
  otp: string | undefined;
}