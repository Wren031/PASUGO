import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { CreateGroceryBranchDto } from "./dto/create-grocery-branch.dto";

import { UpdateGroceryBranchDto } from "./dto/update-grocery-branch.dto";
import { UpdateGroceryBranchStatusDto } from "./dto/update-grocery-branch-status.dto";



@Injectable()
export class GroceryBranchService{
    constructor(
        private prisma: PrismaService, 
    ) {}

    async createBranch(dto: CreateGroceryBranchDto) {
        const item = await this.prisma.groceryBranch.create({
            data: {
            name: dto.name,
            address: dto.address,
            latitude: dto.latitude,
            longitude: dto.longitude,
            phone: dto.phone,
            isOpen: dto.isOpen,
            },
        });

        return {
            message: 'Branch added successfully!',
            item,
        };
    }

    async updateBranch(id: string, dto: UpdateGroceryBranchDto){
        const branch = await this.prisma.groceryBranch.update({
            where:{
                id
            },
            data: {
                name: dto.name,
                address: dto.address,
                latitude: dto.latitude,
                longitude: dto.longitude,
                phone: dto.phone,
                isOpen: dto.isOpen,
            }
        })

        if(!branch){
            throw new NotFoundException('branch not found');
        }
        return {
            message: "Branch updated!",
            branch
        }
    }

    async getAllBranches() {
    const branches = await this.prisma.groceryBranch.findMany({
        orderBy: {
        createdAt: 'desc',
        },
    });

    if (branches.length === 0) {
        return {
        message: 'No grocery branches found.',
        branches: [],
        };
    }

    return {
        message: 'Grocery branches retrieved successfully!',
        branches,
    };
    }

    async updateBranchStatus(id: string, dto: UpdateGroceryBranchStatusDto ){
        const branch = await this.prisma.groceryBranch.update({
            where: {
                id,
            },
            data: {
                status: dto.status
            }
        })

        if(!branch) {
            throw new NotFoundException('branch not found');
        }

          return {
            message: 'Branch status updated successfully!',
            branch,
        };
    }

    async deleteBranch(id: string){
        const branch = await this.prisma.groceryBranch.delete({
            where: {
                id: id
            }
        })

        if(!branch){
            throw new NotFoundException('branch not found')
        }

        return {
            message: "deleted branch",
            branch
        }
    }

    async getOneBranch(id: string) {
        const branch = await this.prisma.groceryBranch.findUnique({
            where: {
                id: id
            },
        });

        if (!branch) {
            throw new NotFoundException('Grocery branch not found');
        }

        return branch;
    }

}