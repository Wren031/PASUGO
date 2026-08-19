import { PartialType } from "@nestjs/mapped-types";
import { BranchInventoryController } from "../branch-inventory.controller";


export class UpdateBranchInventory extends PartialType(BranchInventoryController) {}