import {Module} from '@nestjs/common'
import {GroceryBranchService} from './grocery-branch.service'

import {BranchController} from './grocery-branch.controller'

import {PrismaService} from 'src/modules/prisma/prisma.service'

@Module({
    controllers: [BranchController, BranchController],
    providers: [GroceryBranchService, PrismaService],
    exports: [GroceryBranchService]
})
export class BranchModule {}