import {
    Injectable,
    NotFoundException,
    OnModuleDestroy,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    CreateShipmentDto,
    ShipmentEntity,
    ShipmentResponse,
    UpdateShipmentDto,
} from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { FilterShipmentDto } from "./dtos";

@Injectable()
export class ShipmentService implements OnModuleDestroy {
    constructor(private readonly prisma: PrismaService) {}

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

    private readonly includeRelations = {
        user: true,
        company: true,
        currency: true,
        departure: true,
        arrival: true,
        driver: true,
        customerCompany: true,
        supplierCompany: true,
        logisticsCompany: true,
        shipmentGoods: {
            include: {
                content: true,
            },
        },
        orderShipments: {
            include: {
                order: true,
            },
        },
    };

    async create(
        data: CreateShipmentDto,
        user: CurrentUserDto,
    ): Promise<ShipmentEntity> {
        return this.prisma.shipment.create({
            data: {
                ...data,
                companyId: user.companyId,
                createdBy: user.id,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }

    async findAll(
        user: CurrentUserDto,
        request: FilterShipmentDto,
    ): Promise<ShipmentResponse> {
        const page = Number(request.page) || 1;
        const size = Number(request.size) || 10;
        const skip = (page - 1) * size;

        const where: any = {
            companyId: user.companyId,
        };

        if (request.id) {
            where.id = request.id;
        }

        if (request.status) {
            where.status = request.status;
        }

        if (request.shipmentType) {
            where.shipmentType = request.shipmentType;
        }

        if (request.serviceType) {
            where.serviceType = request.serviceType;
        }

        if (request.userId) {
            where.userId = request.userId;
        }

        if (request.driverId) {
            where.driverId = request.driverId;
        }

        if (request.departureId) {
            where.departureId = request.departureId;
        }

        if (request.arrivalId) {
            where.arrivalId = request.arrivalId;
        }

        if (request.customerId) {
            where.customerId = request.customerId;
        }

        if (request.supplierId) {
            where.supplierId = request.supplierId;
        }

        if (request.logisticsId) {
            where.logisticsId = request.logisticsId;
        }

        if (request.currencyId) {
            where.currencyId = request.currencyId;
        }

        if (request.paymentMethod) {
            where.paymentMethod = request.paymentMethod;
        }

        if (request.startDateFrom || request.startDateTo) {
            where.startDate = {};
            if (request.startDateFrom) {
                where.startDate.gte = new Date(request.startDateFrom);
            }
            if (request.startDateTo) {
                where.startDate.lte = new Date(request.startDateTo);
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

        if (request.notes) {
            where.notes = {
                contains: request.notes,
                mode: "insensitive",
            };
        }

        const [content, totalItems] = await Promise.all([
            this.prisma.shipment.findMany({
                where,
                skip,
                take: size,
                orderBy: { createdAt: "desc" },
                include: this.includeRelations,
            }),
            this.prisma.shipment.count({ where }),
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

    async findOne(
        id: string,
        user: CurrentUserDto,
    ): Promise<ShipmentEntity | null> {
        const shipment = await this.prisma.shipment.findFirst({
            where: { id, companyId: user.companyId },
            include: this.includeRelations,
        });

        if (!shipment) {
            throw new NotFoundException(`Shipment with ID ${id} not found`);
        }

        return shipment;
    }

    async update(
        id: string,
        data: UpdateShipmentDto,
        user: CurrentUserDto,
    ): Promise<ShipmentEntity> {
        // Verify shipment exists and belongs to user's company
        await this.findOne(id, user);

        return this.prisma.shipment.update({
            where: { id, companyId: user.companyId },
            data: {
                ...data,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }

    async remove(id: string, user: CurrentUserDto): Promise<ShipmentEntity> {
        // Verify shipment exists and belongs to user's company
        await this.findOne(id, user);

        return this.prisma.shipment.delete({
            where: { id, companyId: user.companyId },
            include: this.includeRelations,
        });
    }
}
