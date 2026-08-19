import { IsEnum } from 'class-validator';
import { BranchStatus } from '@prisma/client';

export class UpdateGroceryBranchStatusDto {
  @IsEnum(BranchStatus)
  status!: BranchStatus;
}