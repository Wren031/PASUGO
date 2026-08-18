import { DriverVerificationDocumentType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UploadVerificationDto {
  @IsEnum(DriverVerificationDocumentType)
  documentType!: DriverVerificationDocumentType;
}
