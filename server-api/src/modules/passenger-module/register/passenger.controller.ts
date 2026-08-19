

import { Body, Controller, Get, Post, Patch } from "@nestjs/common";
import { CurrentUser } from "src/modules/auth-module/decorators/current-user.decorator";
import { Roles } from "src/modules/auth-module/decorators/roles.decorator";
import { UserRole } from "src/modules/auth-module/enums/user-role.enum";
import { CreatePassengerProfileDto } from "./dto/create-passenger-profile.dto";
import { PassengerService } from "./passenger.service";
import { UpdatePassengerProfileDto } from "./dto/update-passenger-profile.dto";

@Controller('passenger')
export class PassengerController {
    constructor(private readonly passengerService: PassengerService){}

    @Post('create')
    @Roles(UserRole.passenger)
    createController(@CurrentUser('id') userId: string, @Body() dto: CreatePassengerProfileDto) {
        return this.passengerService.create(userId, dto);
    }

    @Get('me')
    @Roles(UserRole.passenger)
    getMyProfile(@CurrentUser('id') userId: string) {
        return this.passengerService.getOne(userId);
    }

    @Post('verify')
    verifyController(@CurrentUser('id') userId: string, @Body() dto: UpdatePassengerProfileDto) {
        return this.passengerService.verify(userId, dto);
    }

    @Get('getAll')
    @Roles(UserRole.admin)
    getAllController() {
        return this.passengerService.getAll();
    }

    @Patch('update')
    @Roles(UserRole.passenger)
    updateController(
        @CurrentUser('id') userId: string,
        @Body() dto: UpdatePassengerProfileDto,
    ) {
        return this.passengerService.update(userId, dto);
    }

    @Post('remove')
    removeController(@CurrentUser('id') userId: string) {
        return this.passengerService.remove(userId);
    }

    @Get('getRideStatistics')
    getRideStatisticsController(@CurrentUser('id') userId: string) {
        return this.passengerService.getRideStatistics(userId);
    }
}