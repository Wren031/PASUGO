/*
  Warnings:

  - You are about to drop the `BranchInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroceryBranch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BranchInventory" DROP CONSTRAINT "BranchInventory_branchId_fkey";

-- DropTable
DROP TABLE "BranchInventory";

-- DropTable
DROP TABLE "GroceryBranch";

-- CreateTable
CREATE TABLE "grocery_branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "phone" TEXT,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "status" "BranchStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grocery_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_inventory" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "costPrice" DECIMAL(10,2),
    "stockQuantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "reservedQuantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "lowStockThreshold" DECIMAL(10,2) DEFAULT 5,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "branch_inventory_branchId_idx" ON "branch_inventory"("branchId");

-- CreateIndex
CREATE INDEX "branch_inventory_productId_idx" ON "branch_inventory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "branch_inventory_branchId_productId_key" ON "branch_inventory"("branchId", "productId");

-- AddForeignKey
ALTER TABLE "branch_inventory" ADD CONSTRAINT "branch_inventory_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "grocery_branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
