import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TransportEntity, TransportResponse } from "@generated";
import {
    CreateTransportInput,
    UpdateTransportInput,
    FilterTransportDto,
} from "./types";
import { TransportFilesService } from "./transport-files.service";
import { convertBigIntegers } from "@utils";
import { CurrentUserDto } from "../users/dtos";

@Injectable()
export class TransportService {
    constructor(
        private readonly transportFilesService: TransportFilesService,
        private readonly prisma: PrismaService,
    ) {}

    private readonly includeRelations = {
        user: true,
        company: true,
        transportFiles: {
            include: {
                file: true,
            },
        },
    };

    async create(
        userId: string,
        { fileIds, ...data }: CreateTransportInput,
        user: CurrentUserDto,
    ): Promise<TransportEntity> {
        const transport = await this.prisma.transport.create({
            data: {
                ...data,
                userId,
                companyId: user.companyId,
            },
            include: this.includeRelations,
        });

        if (transport.id && fileIds?.length > 0) {
            await this.transportFilesService.createMany(
                transport.id,
                fileIds.map((x) => x.id),
            );
        }

        const result = await this.findOne(transport.id, user);
        return result;
    }

    async findAll(
        user: CurrentUserDto,
        request: FilterTransportDto,
    ): Promise<TransportResponse> {
        const page = Number(request.page) || 1;
        const size = Number(request.size) || 10;
        const skip = (page - 1) * size;

        const where: any = {
            companyId: user.companyId,
        };

        if (request.id) {
            where.id = request.id;
        }

        if (request.brand) {
            where.brand = request.brand;
        }

        if (request.model) {
            where.model = {
                contains: request.model,
                mode: "insensitive",
            };
        }

        if (request.yearFrom || request.yearTo) {
            where.year = {};
            if (request.yearFrom) {
                where.year.gte = request.yearFrom;
            }
            if (request.yearTo) {
                where.year.lte = request.yearTo;
            }
        }

        if (request.licensePlate) {
            where.licensePlate = {
                contains: request.licensePlate,
                mode: "insensitive",
            };
        }

        if (request.type) {
            where.type = request.type;
        }

        if (request.vehicleType) {
            where.vehicleType = request.vehicleType;
        }

        if (request.color) {
            where.color = request.color;
        }

        if (request.steeringWheelSide) {
            where.steeringWheelSide = request.steeringWheelSide;
        }

        if (request.transmission) {
            where.transmission = request.transmission;
        }

        if (request.fuelType) {
            where.fuelType = request.fuelType;
        }

        if (request.isTurbo !== undefined) {
            where.isTurbo = request.isTurbo;
        }

        if (request.userId) {
            where.userId = request.userId;
        }

        if (request.notes) {
            where.notes = {
                contains: request.notes,
                mode: "insensitive",
            };
        }

        if (request.inspectionValidFrom || request.inspectionValidTo) {
            where.inspectionValidUntil = {};
            if (request.inspectionValidFrom) {
                where.inspectionValidUntil.gte = new Date(
                    request.inspectionValidFrom,
                );
            }
            if (request.inspectionValidTo) {
                where.inspectionValidUntil.lte = new Date(
                    request.inspectionValidTo,
                );
            }
        }

        if (request.insuranceValidFrom || request.insuranceValidTo) {
            where.insuranceValidUntil = {};
            if (request.insuranceValidFrom) {
                where.insuranceValidUntil.gte = new Date(
                    request.insuranceValidFrom,
                );
            }
            if (request.insuranceValidTo) {
                where.insuranceValidUntil.lte = new Date(
                    request.insuranceValidTo,
                );
            }
        }

        const [content, totalItems] = await Promise.all([
            this.prisma.transport.findMany({
                where,
                skip,
                take: size,
                orderBy: { createdAt: "desc" },
                include: this.includeRelations,
            }),
            this.prisma.transport.count({ where }),
        ]);

        const totalPages = Math.max(Math.ceil(totalItems / size), 1);

        return {
            content: content.map((t) => ({
                ...t,
                transportFiles: convertBigIntegers(t.transportFiles) || [],
            })),
            page,
            size,
            totalItems,
            totalPages,
        };
    }

    async findAllByUserId(
        userId: string,
        user: CurrentUserDto,
    ): Promise<TransportEntity[]> {
        const transports = await this.prisma.transport.findMany({
            where: { userId, companyId: user.companyId },
            orderBy: { updatedAt: "desc" },
            include: this.includeRelations,
        });

        return transports.map((t) => ({
            ...t,
            transportFiles: convertBigIntegers(t.transportFiles) || [],
        }));
    }

    async findOne(
        id: string,
        user: CurrentUserDto,
    ): Promise<TransportEntity | null> {
        const transport = await this.prisma.transport.findFirst({
            where: { id, companyId: user.companyId },
            include: this.includeRelations,
        });

        if (!transport) {
            throw new NotFoundException(`Transport with ID ${id} not found`);
        }

        return {
            ...transport,
            transportFiles: convertBigIntegers(transport.transportFiles) || [],
        };
    }

    async update(
        id: string,
        { fileIds, ...data }: UpdateTransportInput,
        user: CurrentUserDto,
    ): Promise<TransportEntity> {
        // Verify transport exists and belongs to user's company
        await this.findOne(id, user);

        const transport = await this.prisma.transport.update({
            where: { id, companyId: user.companyId },
            data,
            include: this.includeRelations,
        });

        if (transport?.id && fileIds?.length > 0) {
            await this.transportFilesService.sync(transport.id, fileIds);
        }

        return {
            ...transport,
            transportFiles: convertBigIntegers(transport.transportFiles) || [],
        };
    }

    async remove(id: string, user: CurrentUserDto): Promise<TransportEntity> {
        // Verify transport exists and belongs to user's company
        await this.findOne(id, user);

        const transport = await this.prisma.transport.delete({
            where: { id, companyId: user.companyId },
            include: this.includeRelations,
        });

        return {
            ...transport,
            transportFiles: convertBigIntegers(transport.transportFiles) || [],
        };
    }
}
