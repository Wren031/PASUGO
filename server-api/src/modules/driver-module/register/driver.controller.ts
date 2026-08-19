import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
} from '@nestjs/common';

import { CurrentUser } from 'src/modules/auth-module/decorators/current-user.decorator';
import { Roles } from 'src/modules/auth-module/decorators/roles.decorator';
import { UserRole } from 'src/modules/auth-module/enums/user-role.enum';

import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver-dto';

@Controller('driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
  ) {}

  @Post('create')
  @Roles(UserRole.driver)
  async createController(@CurrentUser('id') userId: string, @Body() dto: CreateDriverDto){
    return this.driverService.create(userId, dto);
  }

  @Patch('update')
  @Roles(UserRole.driver) async updateController(@CurrentUser('id') userId: string,@Body() dto: CreateDriverDto) {
    return this.driverService.update(userId, dto);
  }

  @Get('me')
  @Roles(UserRole.driver)
  async getMyProfile(
    @CurrentUser('id') userId: string,
  ) {
    return this.driverService.getOne(userId);
  }

  @Get('getAll')
  @Roles(UserRole.admin)
  async getAllController() {
    return this.driverService.getAll();
  }

  @Post('remove')
  @Roles(UserRole.driver)
  async removeController(
    @CurrentUser('id') userId: string,
  ) {
    return this.driverService.remove(userId);
  }
}