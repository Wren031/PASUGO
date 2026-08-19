import { PartialType } from '@nestjs/mapped-types';
import { CreateGroceryBranchDto } from './create-grocery-branch.dto';

export class UpdateGroceryBranchDto extends PartialType(
  CreateGroceryBranchDto,
) {}