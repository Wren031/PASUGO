import { Body, Controller, Post } from "@nestjs/common";
import { RegistrationCodeService } from "./code.service";
import { CreateCodeDto } from "./dto/create-code.dto";
import { UseRegistrationCodeDto } from "./dto/use-registration-code.dto";

@Controller('registration-code')
export class codeController {
    constructor(private prisma: RegistrationCodeService) {}

    @Post('generate')
    async createController(@Body() dto: CreateCodeDto){
        return this.prisma.createRegistrationCode(dto);
    }

    @Post('validate')
    async useRegistrationCode(
    @Body() dto: UseRegistrationCodeDto,
    ) {
    return this.prisma.useRegistrationCode(dto);
    }
}