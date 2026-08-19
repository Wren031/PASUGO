import { PartialType } from "@nestjs/mapped-types";
import { CreateBranchInventoryDto } from "./create-branch-inventory.dto";

export class UpdateBranchInventory extends PartialType(CreateBranchInventoryDto) {}