import { IsString, IsOptional, IsInt } from 'class-validator';

export class PassengerSearchDto {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  skip?: number;

  @IsInt()
  @IsOptional()
  take?: number;
}