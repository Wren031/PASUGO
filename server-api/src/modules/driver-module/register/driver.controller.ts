import { Body, Controller, Post, Patch, Get} from "@nestjs/common";
import { DriverService } from "./driver.service";
import { CreateDriverDto } from "./dto/create-driver-dto";

@Controller('driver')
export class DriverController {
    constructor(private readonly driverService: DriverService){}


    @Post('create')
    async createController(
        @Body() dto: CreateDriverDto
    ){
        return this.driverService.create('userId', dto);
    }

    @Patch('update')
    async updateController(
        @Body() dto: CreateDriverDto
    ){
        return this.driverService.update('userId', dto);
    }

    @Get('getOne')
    async getOneController(){
        return this.driverService.getOne('userId');
    }

    @Get('getAll')
    async getAllController(){
        return this.driverService.getAll();
    }

    @Post('remove')
    async removeController(){
        return this.driverService.remove('userId');
    }

}