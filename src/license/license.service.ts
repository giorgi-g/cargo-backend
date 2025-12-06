import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLicenseDto, UpdateLicenseDto } from "@generated";

@Injectable()
export class LicenseService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, data: CreateLicenseDto) {
        const license = await this.prisma.license.create({
            data: {
                ...data,
                userId,
            },
        });

        console.log(">>> license", license);

        return license;
    }

    findLicensesByUserId(userId: string) {
        return this.prisma.license.findMany({
            where: { userId },
            include: {
                file: true,
                frontImage: true,
                backImage: true,
                user: true,
            },
        });
    }

    findOne(id: string) {
        return this.prisma.license.findUnique({
            where: { id },
            include: {
                file: true,
                frontImage: true,
                backImage: true,
                user: true,
            },
        });
    }

    update(id: string, data: UpdateLicenseDto) {
        return this.prisma.license.update({
            where: { id },
            data,
        });
    }

    remove(id: string) {
        return this.prisma.license.delete({
            where: { id },
        });
    }
}
