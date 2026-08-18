import { DriverVerificationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateVerificationStatusDto {
  @IsEnum(DriverVerificationStatus)
  status!: DriverVerificationStatus;

  @IsOptional()
  @ValidateIf((dto: UpdateVerificationStatusDto) => dto.status === DriverVerificationStatus.Rejected)
  @IsString()
  @MaxLength(500)
  rejectionReason?: string;
}
