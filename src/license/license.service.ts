import {
    Injectable,
    NotFoundException,
    OnModuleDestroy,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    CreateLicenseDto,
    UpdateLicenseDto,
    LicenseEntity,
    LicenseResponse,
} from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { FilterLicenseDto } from "./types";

@Injectable()
export class LicenseService implements OnModuleDestroy {
    constructor(private readonly prisma: PrismaService) {}

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

    private readonly includeRelations = {
        file: true,
        frontImage: true,
        backImage: true,
        user: true,
    };

    async create(
        userId: string,
        data: CreateLicenseDto,
        user: CurrentUserDto,
    ): Promise<LicenseEntity> {
        // Verify the target user belongs to the same company
        const targetUser = await this.prisma.user.findFirst({
            where: { id: userId, companyId: user.companyId },
        });

        if (!targetUser) {
            throw new NotFoundException(
                `User with ID ${userId} not found in your company`,
            );
        }

        return this.prisma.license.create({
            data: {
                ...data,
                userId,
            },
            include: this.includeRelations,
        });
    }

    async findAll(
        user: CurrentUserDto,
        request: FilterLicenseDto,
    ): Promise<LicenseResponse> {
        const page = Number(request.page) || 1;
        const size = Number(request.size) || 10;
        const skip = (page - 1) * size;

        const where: any = {
            user: {
                companyId: user.companyId,
            },
        };

        if (request.id) {
            where.id = request.id;
        }

        if (request.name) {
            where.name = {
                contains: request.name,
                mode: "insensitive",
            };
        }

        if (request.number) {
            where.number = {
                contains: request.number,
                mode: "insensitive",
            };
        }

        if (request.type) {
            where.type = {
                has: request.type,
            };
        }

        if (request.userId) {
            where.userId = request.userId;
        }

        if (request.validFrom || request.validTo) {
            where.validUntil = {};
            if (request.validFrom) {
                where.validUntil.gte = new Date(request.validFrom);
            }
            if (request.validTo) {
                where.validUntil.lte = new Date(request.validTo);
            }
        }

        if (request.createdAtFrom || request.createdAtTo) {
            where.createdAt = {};
            if (request.createdAtFrom) {
                where.createdAt.gte = new Date(request.createdAtFrom);
            }
            if (request.createdAtTo) {
                where.createdAt.lte = new Date(request.createdAtTo);
            }
        }

        const [content, totalItems] = await Promise.all([
            this.prisma.license.findMany({
                where,
                skip,
                take: size,
                orderBy: { createdAt: "desc" },
                include: this.includeRelations,
            }),
            this.prisma.license.count({ where }),
        ]);

        const totalPages = Math.max(Math.ceil(totalItems / size), 1);

        return {
            content,
            page,
            size,
            totalItems,
            totalPages,
        };
    }

    async findLicensesByUserId(
        userId: string,
        user: CurrentUserDto,
    ): Promise<LicenseEntity[]> {
        // Verify the target user belongs to the same company
        const targetUser = await this.prisma.user.findFirst({
            where: { id: userId, companyId: user.companyId },
        });

        if (!targetUser) {
            throw new NotFoundException(
                `User with ID ${userId} not found in your company`,
            );
        }

        return this.prisma.license.findMany({
            where: { userId },
            include: this.includeRelations,
            orderBy: { createdAt: "desc" },
        });
    }

    async findOne(id: string, user: CurrentUserDto): Promise<LicenseEntity> {
        const license = await this.prisma.license.findFirst({
            where: {
                id,
                user: {
                    companyId: user.companyId,
                },
            },
            include: this.includeRelations,
        });

        if (!license) {
            throw new NotFoundException(`License with ID ${id} not found`);
        }

        return license;
    }

    async update(
        id: string,
        data: UpdateLicenseDto,
        user: CurrentUserDto,
    ): Promise<LicenseEntity> {
        // Verify license exists and belongs to user's company
        await this.findOne(id, user);

        return this.prisma.license.update({
            where: { id },
            data,
            include: this.includeRelations,
        });
    }

    async remove(id: string, user: CurrentUserDto): Promise<LicenseEntity> {
        // Verify license exists and belongs to user's company
        await this.findOne(id, user);

        return this.prisma.license.delete({
            where: { id },
            include: this.includeRelations,
        });
    }
}
