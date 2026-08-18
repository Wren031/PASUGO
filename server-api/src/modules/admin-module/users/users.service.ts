import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserStatusDto } from './dto/user-status-dto';


@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async removeUser(userId: string) {
    const remove_user = await this.prisma.user.delete({
      where: {
        id: userId
      }
    })
    if(!remove_user){
      throw new NotFoundException('No Users profiles found');
    }
    return remove_user;
  }

  async updateStatus(userId: string, dto: UserStatusDto) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: dto.status,
      },
    });
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,

        passengerProfile: {
          select: {
            firstName: true,
            phone: true,
            lastName: true,
          },
        },

        driverProfile: {
          select: {
            firstName: true,
            phone: true,
            lastName: true,
          },
        },
      },
    });

    if (!users || users.length === 0) {
      throw new NotFoundException('No Users profiles found');
    }

    return users;
  }

async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
        where: {
        id: userId,
        },
        select: {
        passengerProfile: {
            select: {
            firstName: true,
            phone: true,
            lastName: true,
            },
        },
        },
    });

    if (!user || !user.passengerProfile) {
        throw new NotFoundException('Passenger profile not found');
    }

    const { firstName, lastName } = user.passengerProfile;
    const {phone} = user.passengerProfile;

    const fullName = [firstName, lastName]
        .filter(Boolean)
        .join(' ');

    return {
        message: `Hello! ${fullName}`,
        contact: `Conatact Number ${phone}`,
    };
    }
}