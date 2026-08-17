import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';

import { PrismaService } from '../prisma/prisma.service';
import { PassengerController } from './passenger.controller';

@Module({
  controllers: [PassengerController, PassengerController],
  providers: [PassengerService, PrismaService],
  exports: [PassengerService],
})
export class PassengerModule {}