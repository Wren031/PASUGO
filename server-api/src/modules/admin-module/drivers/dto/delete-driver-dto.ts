import { IsString } from "class-validator";

export class AdminDeleteDriverDto {
    @IsString()
    userId!: string;
}