import {
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateCodeDto {
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsBoolean()
  @IsOptional()
  isUsed?: boolean;
}