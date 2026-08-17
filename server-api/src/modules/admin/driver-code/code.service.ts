import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCodeDto } from './dto/create-code.dto';

@Injectable()
export class RegistrationCodeService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private generateCode(): string {
    const randomCode = randomBytes(4)
      .toString('hex')
      .toUpperCase();
    return `HGO-DRV-${randomCode}`;
  }

  async createRegistrationCode(dto: CreateCodeDto) {
    let code: string;
    let existingCode: { id: string } | null;

    // Generate a unique code
    do {
      code = this.generateCode();

      existingCode =
        await this.prisma.driverRegistrationCode.findUnique({
          where: {
            code,
          },
          select: {
            id: true,
          },
        });
    } while (existingCode);

    const registrationCode =
      await this.prisma.driverRegistrationCode.create({
        data: {
          code,
          expiresAt: dto.expiresAt
            ? new Date(dto.expiresAt)
            : null,
          isUsed: false,
        },
      });

    return {
      message: 'Registration code created successfully',
      code: registrationCode,
    };
  }
}