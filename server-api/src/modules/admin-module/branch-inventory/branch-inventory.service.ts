import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateBranchInventoryDto } from './dto/create-branch-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createInventory(branchId: string, dto: CreateBranchInventoryDto) {
    const branch = await this.prisma.groceryBranch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new NotFoundException('Grocery branch not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingInventory = await this.prisma.branchInventory.findUnique({
      where: {
        branchId_productId: {
          branchId,
          productId: dto.productId,
        },
      },
    });

    if (existingInventory) {
      throw new ConflictException(
        'This product already exists in this branch inventory',
      );
    }

    const inventory = await this.prisma.branchInventory.create({
      data: {
        branchId,
        productId: dto.productId,
        sku: dto.sku,
        barcode: dto.barcode,
        price: dto.price,
        costPrice: dto.costPrice,
        stockQuantity: dto.stockQuantity ?? 0,
        reservedQuantity: dto.reservedQuantity ?? 0,
        lowStockThreshold: dto.lowStockThreshold ?? 5,
        isAvailable: dto.isAvailable ?? true,
        isFeatured: dto.isFeatured ?? false,
      },
      include: {
        branch: true,
        product: true,
      },
    });

    return {
      message: 'Item added successfully!',
      inventory,
    };
  }
}
