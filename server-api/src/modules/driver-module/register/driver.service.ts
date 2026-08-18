import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateDriverDto } from "./dto/create-driver-dto";
import { UpdateDriverDto } from "./dto/update-driver-dto";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class DriverService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateDriverDto) {
        const driver = await this.prisma.driverProfile.create({
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
            }
        })
        
        return driver;
    }

    async update(userId: string, dto: UpdateDriverDto) {
        const not_found = await this.prisma.driverProfile.findUnique({
            where: { userId },
        })

        if (!not_found) {
            throw new NotFoundException('Driver profile not found');
        }

        const update_driver = await this.prisma.driverProfile.update({
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
            }
        })
        return update_driver;
    }

    async getOne(userId: string) {
        const driver = await this.prisma.driverProfile.findUnique({
            where: { userId }
        })
        if (!driver) {
            throw new NotFoundException('Driver profile not found');
        }
        return driver;
    }

    async getAll(){
        const drivers = await this.prisma.driverProfile.findMany();
        if (!drivers || drivers.length === 0) {
            throw new NotFoundException('No driver profiles found');
        }
        return drivers;
    }

    async remove(userId: string){
        try {
            const deletedDriver = await this.prisma.driverProfile.delete({
                where: { userId }
            });
            if (!deletedDriver) {
                throw new NotFoundException('Driver profile not found');
            }
            return deletedDriver;
        }
        catch (error) {
            throw new NotFoundException('Driver profile not found');
        }
    }

}