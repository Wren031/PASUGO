import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "src/modules/auth-module/decorators/roles.decorator";
import { UserRole } from "src/modules/auth-module/enums/user-role.enum";
import { RegistrationCodeService } from "./code.service";
import { CreateCodeDto } from "./dto/create-code.dto";
import { UseRegistrationCodeDto } from "./dto/use-registration-code.dto";

@Controller('registration-code')
export class codeController {
    constructor(private prisma: RegistrationCodeService) {}

    @Roles(UserRole.admin)
    @Post('generate')
    async createController(@Body() dto: CreateCodeDto){
        return this.prisma.createRegistrationCode(dto);
    }

    @Public()
    @Post('validate')
    async useRegistrationCode(
    @Body() dto: UseRegistrationCodeDto,
    ) {
    return this.prisma.useRegistrationCode(dto);
    }
}