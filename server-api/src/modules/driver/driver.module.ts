import { Module } from '@nestjs/common';
import {DriverService} from './driver.service';

import { PrismaService } from '../prisma/prisma.service';
import { DriverController } from './driver.controller';

@Module({
  controllers: [DriverController, DriverController],
  providers: [DriverService, PrismaService],
  exports: [DriverService],
})
export class DriverModule {}