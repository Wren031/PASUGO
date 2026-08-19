import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePassengerProfileDto } from './dto/create-passenger-profile.dto';
import { UpdatePassengerProfileDto } from './dto/update-passenger-profile.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
@Injectable()
export class PassengerService {
  constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreatePassengerProfileDto) {
      const profile = await this.prisma.passengerProfile.create({
        data: {
          userId: userId,
          firstName: dto.firstName,
          middleName: dto.middleName,
          lastName: dto.lastName,
          profilePhoto: dto.profilePhoto,
          dateOfBirth: dto.dateOfBirth,
          gender: dto.gender,
          phone: dto.phone,
          address: dto.address,
          city: dto.city,
          province: dto.province,
          emergencyName: dto.emergencyName,
          emergencyPhone: dto.emergencyPhone,
          emergencyRelation: dto.emergencyRelation,
          totalRides: 0,
          cancelledRides: 0,
        }
      })
      return profile;
    }

    async update(userId: string, dto: UpdatePassengerProfileDto) {
      const not_found = await this.prisma.passengerProfile.findUnique({
        where: { userId },
      });

      if (!not_found) {
        throw new NotFoundException('Passenger profile not found');
      }

      const update_passenger = await this.prisma.passengerProfile.update({
        where: { userId },
        data: {
          firstName: dto.firstName,
          middleName: dto.middleName,
          lastName: dto.lastName,
          profilePhoto: dto.profilePhoto,
          dateOfBirth: dto.dateOfBirth,
          gender: dto.gender,
          phone: dto.phone,
          address: dto.address,
          city: dto.city,
          province: dto.province,
          emergencyName: dto.emergencyName,
          emergencyPhone: dto.emergencyPhone,
          emergencyRelation: dto.emergencyRelation,
        },
      })
      return update_passenger;
    }

    async getOne(userId: string) {
      const profile = await this.prisma.passengerProfile.findUnique({
        where: { userId },
      })

      if (!profile) {
        throw new NotFoundException('Passenger profile not found');
      }

      return profile;
    }

    async verify(userId: string, dto: UpdatePassengerProfileDto) {
      const profile = await this.prisma.passengerProfile.findUnique({
        where: { userId },
      })

      if (!profile) {
        throw new NotFoundException('Passenger profile not found');
      }

      return this.prisma.passengerProfile.update({
        where: { userId },
        data: {
          firstName: dto.firstName,
          middleName: dto.middleName,
          lastName: dto.lastName,
          profilePhoto: dto.profilePhoto,
          dateOfBirth: dto.dateOfBirth,
          gender: dto.gender,
          phone: dto.phone,
          address: dto.address,
          city: dto.city,
          province: dto.province,
          emergencyName: dto.emergencyName,
          emergencyPhone: dto.emergencyPhone,
          emergencyRelation: dto.emergencyRelation,
          isVerified: true,
        },
      });
    }

    async getAll(){
      const profiles = await this.prisma.passengerProfile.findMany();
      if (!profiles || profiles.length === 0) {
        throw new NotFoundException('No passenger profiles found');
      }
      return profiles;
    }

  async remove(userId: string) {
    try {
      return await this.prisma.passengerProfile.delete({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new NotFoundException('Passenger profile not found');
    }
  }

  async getRideStatistics(userId: string) {
    const profile = await this.prisma.passengerProfile.findUnique({
      where: { userId },
      select: {
        totalRides: true,
        cancelledRides: true,
        averageRating: true,
      },
    });
    if (!profile) {
      throw new NotFoundException('Passenger profile not found');
    }
    return {
      totalRides: profile.totalRides,
      cancelledRides: profile.cancelledRides,
      averageRating: profile.averageRating,
    };
  }
}