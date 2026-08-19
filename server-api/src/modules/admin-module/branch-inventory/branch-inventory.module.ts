import { Module } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { BranchInventoryController } from './branch-inventory.controller';
import { InventoryService } from './branch-inventory.service';

@Module({
  controllers: [BranchInventoryController],
  providers: [InventoryService, PrismaService],
  exports: [InventoryService],
})
export class BranchInventoryModule {}
