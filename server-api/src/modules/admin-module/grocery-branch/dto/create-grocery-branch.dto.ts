import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateGroceryBranchDto {
    
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsPhoneNumber('PH')
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}