import { IsString, IsOptional, IsDateString, IsBooleanString } from 'class-validator';

export class CreateCodeDto {
  @IsString()
  code!: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsBooleanString()
  @IsOptional()
  isUsed?: boolean;
}