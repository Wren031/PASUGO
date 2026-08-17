import { Gender } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateDriverDto {

    @IsString()
    firstName!: string;

    @IsString()
    @IsOptional()
    middleName?: string;

    @IsString()
    lastName!: string;

    @IsString()
    profilePhoto?: string;

    @IsDateString()
    dateOfBirth?: string;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    province?: string;

    @IsString()
    @IsOptional()
    emergencyName?: string;

    @IsString()
    @IsOptional()
    emergencyPhone?: string;

    @IsString()
    @IsOptional()
    emergencyRelation?: string;
}