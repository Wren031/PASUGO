import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/modules/prisma/prisma.module';


import { AdminDriverService } from './driver.service';
import { AdminDriverController } from './driver.controller';
import { DriverModule } from 'src/modules/driver-module/register/driver.module';

@Module({
  imports: [
    PrismaModule,
    DriverModule,
  ],
  controllers: [
    AdminDriverController,
  ],
  providers: [
    AdminDriverService,
  ],
  exports: [
    AdminDriverService,
  ],
})
export class AdminDriverModule {}