import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/modules/auth-module/decorators/roles.decorator';
import { UserRole } from 'src/modules/auth-module/enums/user-role.enum';

import { UserStatusDto } from './dto/user-status-dto';
import { UserService } from './users.service';

@Controller('users')
@Roles(UserRole.admin)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

    @Patch(':userId/status')
    async updateStatus(@Param('userId') userId: string, @Body() dto: UserStatusDto) {
        return this.userService.updateStatus(userId, dto);
   }

    @Get(':userId/profile')
    async getUserProfile(@Param('userId') userId: string)
    {
      return this.userService.getUserProfile(userId)
    }

  @Get('getAll')
  async getAllUsers(){
    return this.userService.getAllUsers();
  }

  @Delete(':userId')
  async removeUser(@Param('userId') userId: string) {
    return this.userService.removeUser(userId);
  }
}