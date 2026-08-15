import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Current password is required' })
  currentPassword: string;

  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).*$/, {
    message: 'New password must contain at least one letter and one number',
  })
  newPassword: string;
}