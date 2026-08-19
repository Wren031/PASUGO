import { Body, Controller, Get, Param, Patch, Post, Delete } from "@nestjs/common";


import { GroceryBranchService } from './grocery-branch.service';
import { CreateGroceryBranchDto } from './dto/create-grocery-branch.dto';
import { UpdateGroceryBranchDto } from './dto/update-grocery-branch.dto';
import { UserRole } from "src/modules/auth-module/enums/user-role.enum";
import { Roles } from "src/modules/auth-module/decorators/roles.decorator";
import { UpdateGroceryBranchStatusDto } from "./dto/update-grocery-branch-status.dto";


@Roles(UserRole.admin)
@Controller("grocery-branches")
export class BranchController{
    constructor(
        private readonly groceryBranchService: GroceryBranchService,
    ){}

    @Post()
    async createBranch(@Body() dto: CreateGroceryBranchDto,){
        return this.groceryBranchService.createBranch(dto);
    }

    @Patch(':id')
    async updateBranch(@Param('id') id: string, @Body() dto: UpdateGroceryBranchDto){
        return this.groceryBranchService.updateBranch(id, dto)
    }

    @Patch(':id')
    async updateBranchStatus(@Param('id') id: string, @Body() dto: UpdateGroceryBranchStatusDto){
        return this.groceryBranchService.updateBranchStatus(id, dto)
    }

    @Get()
    async getAllBranch(){
        return this.groceryBranchService.getAllBranches();
    }

    @Get(':id')
    async getOneBranch(@Param('id') id: string){
        return this.groceryBranchService.getOneBranch(id);
    }

    @Delete(':id')
    async deleteBranch(@Param('id') id: string){
        return this.groceryBranchService.deleteBranch(id)
    }

}