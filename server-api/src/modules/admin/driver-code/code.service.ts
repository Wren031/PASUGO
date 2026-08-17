import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { UseRegistrationCodeDto } from './dto/use-registration-code.dto';

@Injectable()
export class RegistrationCodeService {
  constructor(private readonly prisma: PrismaService) {}

  private generateRegistrationCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let randomCode = '';

    for (let i = 0; i < 8; i++) {
      randomCode += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return `HGO-DRV-${randomCode}`;
  }

  async createRegistrationCode(dto: CreateCodeDto) {
    let code: string;

    while (true) {
      code = this.generateRegistrationCode();

      const existing =
        await this.prisma.driverRegistrationCode.findUnique({
          where: { code },
        });

      if (!existing) {
        break;
      }
    }

    const expiresAt = dto.expiresAt
      ? new Date(dto.expiresAt)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const registrationCode =
      await this.prisma.driverRegistrationCode.create({
        data: {
          code,
          expiresAt,
          isUsed: dto.isUsed ?? false,
        },
      });

    return {
      message: 'Driver registration code generated successfully',
      data: registrationCode,
    };
  }

  async validateRegistrationCode(code: string) {
    const registrationCode =
      await this.prisma.driverRegistrationCode.findUnique({
        where: { code },
      });

    if (!registrationCode) {
      throw new BadRequestException(
        'Invalid driver registration code',
      );
    }

    if (registrationCode.isUsed) {
      throw new BadRequestException(
        'This driver registration code has already been used',
      );
    }

    if (
      registrationCode.expiresAt &&
      registrationCode.expiresAt < new Date()
    ) {
      throw new BadRequestException(
        'This driver registration code has expired',
      );
    }

    return {
      valid: true,
      message: 'Driver registration code is valid',
      code: registrationCode.code,
    };
  }

  async useRegistrationCode(dto: UseRegistrationCodeDto) {
    const registrationCode =
      await this.prisma.driverRegistrationCode.findUnique({
        where: {
          code: dto.code,
        },
      });

    if (!registrationCode) {
      throw new BadRequestException(
        'Invalid driver registration code',
      );
    }

    if (registrationCode.isUsed) {
      throw new BadRequestException(
        'This driver registration code has already been used',
      );
    }

    if (
      registrationCode.expiresAt &&
      registrationCode.expiresAt < new Date()
    ) {
      throw new BadRequestException(
        'This driver registration code has expired',
      );
    }

    return this.prisma.driverRegistrationCode.update({
      where: {
        code: dto.code,
      },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });
  }
}