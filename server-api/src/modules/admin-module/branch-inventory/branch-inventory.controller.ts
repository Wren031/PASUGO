import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserRole } from 'src/modules/auth-module/enums/user-role.enum';
import { Roles } from 'src/modules/auth-module/decorators/roles.decorator';
import { CreateBranchInventoryDto } from './dto/create-branch-inventory.dto';
import { InventoryService } from './branch-inventory.service';

@Roles(UserRole.admin)
@Controller('grocery-branches/:branchId/inventory')
export class BranchInventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async createInventory(@Param('branchId') branchId: string,@Body() dto: CreateBranchInventoryDto) {
    return this.inventoryService.createInventory(branchId, dto);
  }
}
