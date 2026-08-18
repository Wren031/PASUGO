import { Injectable, NotFoundException } from "@nestjs/common";
import { DriverVerificationDocumentType, DriverVerificationStatus } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";
import {DriverService} from "src/modules/driver-module/register/driver.service";
import { VerificationService } from "src/modules/driver-module/verification/verification.service";
import { AdminDeleteDriverDto } from "./dto/delete-driver-dto";

@Injectable()
export class AdminDriverService {

    constructor(
        private prisma: PrismaService, 
        private readonly driverService: DriverService,
        private readonly verificationService: VerificationService,
    ) {}

    async deleteDriver(userId: string, dto: AdminDeleteDriverDto) {
        const driver = await this.prisma.driverProfile.findUnique({
            where: {
                userId: dto.userId,
            },
        });

        if (!driver) {
            throw new NotFoundException('Driver not found');
        }

        await this.prisma.driverProfile.delete({
            where: {
                userId: dto.userId,
            },
        });

        return {
            message: 'Driver deleted successfully',
        };
    }

    async getAllDrivers(){
        const drivers = await this.driverService.getAll();
        if (!drivers || drivers.length === 0) {
            throw new NotFoundException('No drivers found');
        }
        return {
            data: drivers,
        };
    }

    getVerificationDocuments(userId: string) {
        return this.verificationService.listForDriver(userId);
    }

    getVerificationDocument(userId: string, documentType: DriverVerificationDocumentType) {
        return this.verificationService.getForDriver(userId, documentType);
    }

    updateVerificationStatus(
        userId: string,
        documentType: DriverVerificationDocumentType,
        status: DriverVerificationStatus,
        rejectionReason?: string,
    ) {
        return this.verificationService.updateStatusForUser(
            userId,
            documentType,
            status,
            rejectionReason,
        );
    }

    getOverallVerificationStatus(userId: string) {
        return this.verificationService.getOverallStatusForUser(userId);
    }

    getVerificationFilePath(filePath: string) {
        return this.verificationService.getAbsoluteFilePath(filePath);
    }
}
