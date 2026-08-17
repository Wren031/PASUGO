import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountStatus, OtpPurpose, Prisma, Role, User, PassengerProfile } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

import { UserRole } from './enums/user-role.enum';
import { AuthUser } from './types/auth-user.type';
import { JwtPayload } from './types/jwt-payload.type';
import { VerifyOtpDto } from './dto/verify-otp.dto';

const BCRYPT_ROUNDS = 12;
const OTP_TTL_MINUTES = 10;

const USER_SELECT = {
  id: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role,
        status: AccountStatus.Pending,
      },
    });

    return this.issueOtp(user.email, OtpPurpose.verify_email);
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new BadRequestException('No account found for this email');
    }

    await this.validateOtp(dto.email, OtpPurpose.verify_email, dto.otp);
    await this.markOtpUsed(dto.email, OtpPurpose.verify_email, dto.otp);

    const activated = await this.prisma.user.update({
      where: { id: user.id },
      data: { status: AccountStatus.Active },
      select: USER_SELECT,
    });

    if (activated.role === Role.passenger) {
      await this.prisma.passengerProfile.upsert({
        where: { userId: activated.id },
        create: {
          userId: activated.id,
          totalRides: 0,
          cancelledRides: 0,
          averageRating: null,
        },
        update: {
          totalRides: 0,
          cancelledRides: 0,
          averageRating: null,
        },
      });
    }

    return this.issueTokens(activated);
  }

  async resendOtp(dto: ResendOtpDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new BadRequestException('No account found for this email');
    }

    if (user.status === AccountStatus.Active) {
      throw new BadRequestException('This account is already verified');
    }

    return this.issueOtp(user.email, OtpPurpose.verify_email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === AccountStatus.Pending) {
      throw new ForbiddenException('Please verify your email first');
    }

    if (user.status !== AccountStatus.Active) {
      throw new ForbiddenException('This account is not accessible');
    }

    const tokens = await this.issueTokens(this.toAuthUser(user));

    return {
      message: 'Login successful',
      ...tokens,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const tokenHash = this.hashToken(dto.refreshToken);

    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null },
    });

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: stored.userId },
      select: USER_SELECT,
    });

    if (!user || user.status !== AccountStatus.Active) {
      throw new UnauthorizedException('Account is not accessible');
    }

    const newRefreshToken = await this.signRefreshToken(user.id);

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
      }),
      this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: this.hashToken(newRefreshToken),
          expiresAt: this.refreshExpiry(),
        },
      }),
    ]);

    const { accessToken } = await this.issueTokens(user);

    return { accessToken, refreshToken: newRefreshToken };
  }

async logout(dto: RefreshTokenDto): Promise<{ message: string }> {
    const tokenHash = this.hashToken(dto.refreshToken);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return {
      message: 'Logout successful',
    };
  }
  
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      return { sent: true };
    }

    return this.issueOtp(user.email, OtpPurpose.reset_password);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new BadRequestException('No account found for this email');
    }

    await this.validateOtp(dto.email, OtpPurpose.reset_password, dto.otp);
    await this.markOtpUsed(dto.email, OtpPurpose.reset_password, dto.otp);

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS) as string;

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS) as string;

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  private async issueOtp(email: string, purpose: OtpPurpose) {
    await this.prisma.otpCode.updateMany({
      where: { email, purpose, usedAt: null },
      data: { usedAt: new Date() },
    });

    const otp = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);

    await this.prisma.otpCode.create({
      data: {
        email,
        purpose,
        codeHash: this.hashToken(otp),
        expiresAt,
      },
    });

    const reveal = this.configService.get<string>('DEV_REVEAL_OTP') === 'true';
    const payload: { otpExpiresAt: Date; devOtp?: string } = { otpExpiresAt: expiresAt };

    if (reveal) {
      payload.devOtp = otp;
    }

    return payload;
  }

  private async validateOtp(email: string, purpose: OtpPurpose, otp: string) {
    const record = await this.prisma.otpCode.findFirst({
      where: { email, purpose, usedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('No active OTP for this email');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired, please request a new one');
    }

    if (record.codeHash !== this.hashToken(otp)) {
      throw new BadRequestException('Invalid OTP');
    }
  }

  private async markOtpUsed(email: string, purpose: OtpPurpose, otp: string) {
    await this.prisma.otpCode.updateMany({
      where: { email, purpose, codeHash: this.hashToken(otp), usedAt: null },
      data: { usedAt: new Date() },
    });
  }

  private async issueTokens(user: AuthUser) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken, user: this.serializeUser(user) };
  }

  private async generateAccessToken(user: AuthUser): Promise<string> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_TTL'),
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const signed = await this.signRefreshToken(userId);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(signed),
        expiresAt: this.refreshExpiry(),
      },
    });

    return signed;
  }

  private async signRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(48).toString('hex');
    const payload: JwtPayload = { sub: userId, email: '', role: UserRole.passenger };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: `${this.refreshTtlDays()}d`,
    });
  }

  private refreshTtlDays(): number {
    return Number(this.configService.get<string>('JWT_REFRESH_TTL_DAYS') ?? 30);
  }

  private refreshExpiry(): Date {
    return new Date(Date.now() + this.refreshTtlDays() * 24 * 60 * 60 * 1000);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  private serializeUser(user: AuthUser) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  }
}