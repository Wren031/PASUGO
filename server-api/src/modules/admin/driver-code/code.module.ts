import { Module } from '@nestjs/common';
import {RegistrationCodeService} from './code.service';


import { codeController } from './code.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  controllers: [codeController, codeController],
  providers: [RegistrationCodeService, PrismaService],
  exports: [RegistrationCodeService],
})
export class RegistrationCodeModule {}