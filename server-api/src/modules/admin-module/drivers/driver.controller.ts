import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Patch, Post, Res, StreamableFile } from "@nestjs/common";
import { DriverVerificationDocumentType } from "@prisma/client";
import { Response } from "express";
import { createReadStream } from "fs";
import { Roles } from "src/modules/auth-module/decorators/roles.decorator";
import { UserRole } from "src/modules/auth-module/enums/user-role.enum";
import { AdminDriverService } from "./driver.service";
import { AdminDeleteDriverDto } from "./dto/delete-driver-dto";
import { UpdateVerificationStatusDto } from "src/modules/driver-module/verification/dto/update-verification-status.dto";


@Controller('admin-driver-controller')
export class AdminDriverController {
    constructor(private readonly driverService: AdminDriverService) {}

    @Delete('admin-delete-driver/:userId')
    async deleteDriverController(userId: string, @Body() dto: AdminDeleteDriverDto) {
        return this.driverService.deleteDriver(userId, dto);
    }

    @Get('admin-get-all-drivers')
    async getAllDriversController() {
        return this.driverService.getAllDrivers();
    }

    @Get(':userId/verification')
    @Roles(UserRole.admin)
    getVerificationDocuments(@Param('userId') userId: string) {
        return this.driverService.getVerificationDocuments(userId);
    }

    @Get(':userId/verification/status')
    @Roles(UserRole.admin)
    getOverallVerificationStatus(@Param('userId') userId: string) {
        return this.driverService.getOverallVerificationStatus(userId);
    }

    @Get(':userId/verification/:documentType')
    @Roles(UserRole.admin)
    async getVerificationImage(
        @Param('userId') userId: string,
        @Param('documentType', new ParseEnumPipe(DriverVerificationDocumentType))
        documentType: DriverVerificationDocumentType,
        @Res({ passthrough: true }) response: Response,
    ) {
        const verification = await this.driverService.getVerificationDocument(userId, documentType);
        response.type(verification.filePath.endsWith('.png') ? 'image/png' : verification.filePath.endsWith('.webp') ? 'image/webp' : 'image/jpeg');
        return new StreamableFile(createReadStream(this.driverService.getVerificationFilePath(verification.filePath)));
    }

    @Patch(':userId/verification/:documentType/status')
    @Roles(UserRole.admin)
    updateVerificationStatus(
        @Param('userId') userId: string,
        @Param('documentType', new ParseEnumPipe(DriverVerificationDocumentType))
        documentType: DriverVerificationDocumentType,
        @Body() dto: UpdateVerificationStatusDto,
    ) {
        return this.driverService.updateVerificationStatus(
            userId,
            documentType,
            dto.status,
            dto.rejectionReason,
        );
    }
}
