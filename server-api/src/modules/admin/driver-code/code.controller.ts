import { Body, Controller, Post } from "@nestjs/common";
import { RegistrationCodeService } from "./code.service";
import { CreateCodeDto } from "./dto/create-code.dto";

@Controller('generate-code')
export class codeController {
    constructor(private prisma: RegistrationCodeService) {}


    @Post('create')
    async createController(@Body() dto: CreateCodeDto){
        return this.prisma.createRegistrationCode(dto);
    }
}