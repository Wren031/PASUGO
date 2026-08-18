import { AccountStatus } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class UserStatusDto {
    @IsString()
    userId!: string;

    @IsEnum(AccountStatus)
    status!: AccountStatus;
}