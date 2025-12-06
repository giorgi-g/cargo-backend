import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePackageDto, PackageEntity, UpdatePackageDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";

@Injectable()
export class PackageService implements OnModuleDestroy {
    constructor(private readonly prisma: PrismaService) {}

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

    async create(
        data: CreatePackageDto,
        user: CurrentUserDto,
    ): Promise<PackageEntity> {
        return this.prisma.package.create({
            data: {
                ...data,
                companyId: user.companyId,
                userId: user.id,
                additionalProfit: data.additionalProfit,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                totalPrice: 0, // TODO Price in USD needs to be calculated here
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: user.id,
                updatedBy: user.id,
            },
        });
    }

    async findAll(user: CurrentUserDto): Promise<PackageEntity[]> {
        return this.prisma.package.findMany({
            where: { createdBy: user.id, companyId: user.companyId },
        });
    }

    async findOne(
        id: string,
        user: CurrentUserDto,
    ): Promise<PackageEntity | null> {
        return this.prisma.package.findFirst({
            where: { id, createdBy: user.id, companyId: user.companyId },
        });
    }

    async update(
        id: string,
        data: UpdatePackageDto,
        user: CurrentUserDto,
    ): Promise<PackageEntity> {
        return this.prisma.package.update({
            where: { id },
            data: {
                ...data,
                updatedBy: user.id,
            },
        });
    }

    async remove(id: string, user: CurrentUserDto): Promise<PackageEntity> {
        return this.prisma.package.delete({
            where: { id, companyId: user.companyId },
        });
    }
}
