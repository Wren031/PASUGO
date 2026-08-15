import { IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;

  @IsEmail({}, { message: 'A valid email is required' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).*$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be passenger or driver' })
  role: UserRole;
}