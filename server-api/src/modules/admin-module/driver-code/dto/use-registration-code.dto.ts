import { IsNotEmpty, IsString } from 'class-validator';

export class UseRegistrationCodeDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}