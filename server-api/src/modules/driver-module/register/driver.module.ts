import { Module } from '@nestjs/common';
import {DriverService} from './driver.service';

import { DriverController } from './driver.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [VerificationModule],
  controllers: [DriverController, DriverController],
  providers: [DriverService, PrismaService],
  exports: [DriverService, VerificationModule],
})
export class DriverModule {}
