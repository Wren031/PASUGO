import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DriverVerificationDocumentType,
  DriverVerificationStatus,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join, resolve, sep } from 'path';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UploadedImage } from './types/uploaded-image.type';

const REQUIRED_DOCUMENTS = Object.values(DriverVerificationDocumentType);

@Injectable()
export class VerificationService {
  private readonly uploadDirectory: string;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.uploadDirectory = resolve(
      configService.get<string>(
        'DRIVER_VERIFICATION_UPLOAD_DIR',
        'uploads/driver-verification',
      ),
    );
  }

  async upload(
    userId: string,
    documentType: DriverVerificationDocumentType,
    file: UploadedImage,
  ) {
    const profile = await this.getProfile(userId);
    const existing = await this.prisma.driverVerification.findUnique({
      where: { driverProfileId_documentType: { driverProfileId: profile.id, documentType } },
    });

    if (existing?.status === DriverVerificationStatus.Approved) {
      throw new ConflictException('Approved documents cannot be replaced');
    }

    const filePath = await this.saveFile(profile.id, documentType, file);
    let verification;
    try {
      verification = existing
        ? await this.prisma.driverVerification.update({
            where: { id: existing.id },
            data: { filePath, status: DriverVerificationStatus.Pending, rejectionReason: null },
          })
        : await this.prisma.driverVerification.create({
            data: { driverProfileId: profile.id, documentType, filePath },
          });
    } catch (error) {
      await this.deleteFile(filePath);
      throw error;
    }

    if (existing) {
      await this.deleteFile(existing.filePath);
    }

    return verification;
  }

  async listForDriver(userId: string) {
    const profile = await this.getProfile(userId);
    return this.listForProfile(profile.id);
  }

  async listForProfile(driverProfileId: string) {
    await this.getProfileById(driverProfileId);
    return this.prisma.driverVerification.findMany({
      where: { driverProfileId },
      orderBy: { documentType: 'asc' },
    });
  }

  async getForDriver(userId: string, documentType: DriverVerificationDocumentType) {
    const profile = await this.getProfile(userId);
    return this.getForProfileDocument(profile.id, documentType);
  }

  async getForProfileDocument(
    driverProfileId: string,
    documentType: DriverVerificationDocumentType,
  ) {
    await this.getProfileById(driverProfileId);
    const verification = await this.prisma.driverVerification.findUnique({
      where: { driverProfileId_documentType: { driverProfileId, documentType } },
    });

    if (!verification) {
      throw new NotFoundException('Verification document not found');
    }

    return verification;
  }

  async updateStatus(
    driverProfileId: string,
    documentType: DriverVerificationDocumentType,
    status: DriverVerificationStatus,
    rejectionReason?: string,
  ) {
    const verification = await this.getForProfileDocument(driverProfileId, documentType);

    if (status === DriverVerificationStatus.Rejected && !rejectionReason?.trim()) {
      throw new BadRequestException('A rejection reason is required');
    }

    return this.prisma.driverVerification.update({
      where: { id: verification.id },
      data: {
        status,
        rejectionReason: status === DriverVerificationStatus.Rejected ? rejectionReason!.trim() : null,
      },
    });
  }

  async getOverallStatus(driverProfileId: string) {
    const documents = await this.listForProfile(driverProfileId);
    const byType = new Map(documents.map((document) => [document.documentType, document.status]));

    return {
      status:
        REQUIRED_DOCUMENTS.every((type) => byType.get(type) === DriverVerificationStatus.Approved)
          ? DriverVerificationStatus.Approved
          : documents.some((document) => document.status === DriverVerificationStatus.Rejected)
            ? DriverVerificationStatus.Rejected
            : DriverVerificationStatus.Pending,
      submittedDocuments: documents.length,
      requiredDocuments: REQUIRED_DOCUMENTS.length,
    };
  }

  async getOverallStatusForUser(userId: string) {
    const profile = await this.getProfile(userId);
    return this.getOverallStatus(profile.id);
  }

  async updateStatusForUser(
    userId: string,
    documentType: DriverVerificationDocumentType,
    status: DriverVerificationStatus,
    rejectionReason?: string,
  ) {
    const profile = await this.getProfile(userId);
    return this.updateStatus(profile.id, documentType, status, rejectionReason);
  }

  getAbsoluteFilePath(filePath: string) {
    const absolutePath = resolve(this.uploadDirectory, filePath);
    if (!absolutePath.startsWith(`${this.uploadDirectory}${sep}`)) {
      throw new BadRequestException('Invalid verification file path');
    }
    return absolutePath;
  }

  private async getProfile(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }
    return profile;
  }

  private async getProfileById(id: string) {
    const profile = await this.prisma.driverProfile.findUnique({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }
    return profile;
  }

  private async saveFile(
    driverProfileId: string,
    documentType: DriverVerificationDocumentType,
    file: UploadedImage,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('An image file is required');
    }

    const extension = file.mimetype === 'image/png' ? '.png' : file.mimetype === 'image/webp' ? '.webp' : '.jpg';
    const relativePath = join(driverProfileId, `${documentType}-${randomUUID()}${extension}`);
    const absolutePath = this.getAbsoluteFilePath(relativePath);
    await fs.mkdir(join(this.uploadDirectory, driverProfileId), { recursive: true });
    await fs.writeFile(absolutePath, file.buffer);
    return relativePath;
  }

  private async deleteFile(filePath: string) {
    try {
      await fs.unlink(this.getAbsoluteFilePath(filePath));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
