

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreatePassengerProfileDto } from "./dto/create-passenger-profile.dto";
import { PassengerService } from "./passenger.service";
import { UpdatePassengerProfileDto } from "./dto/update-passenger-profile.dto";
@Controller('passenger')
export class PassengerController {
    constructor(private readonly passengerService: PassengerService){}

    @Post('create')
    createController(@Body() dto: CreatePassengerProfileDto) {
        return this.passengerService.create('userId', dto);
    }

    @Get('getOne/:userId')
    getOneController(@Param('userId') userId: string) {
        return this.passengerService.getOne(userId);
    }
     
    @Get('getAll')
    getAllController() {
        return this.passengerService.getAll();
    }

    @Post('update/:userId')
    updateController(@Param('userId') userId: string, @Body() dto: UpdatePassengerProfileDto) {
        return this.passengerService.update(userId, dto);
    }

    @Post('remove/:userId')
    removeController(@Param('userId') userId: string) {
        return this.passengerService.remove(userId);
    }

    @Get('getRideStatistics/:userId')
    getRideStatisticsController(@Param('userId') userId: string) {
        return this.passengerService.getRideStatistics(userId);
    }
}