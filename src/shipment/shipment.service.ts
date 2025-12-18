import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    CreateShipmentDto,
    ShipmentEntity,
    ShipmentResponse,
    UpdateShipmentDto,
    ShipmentGoodsEntity,
} from "@generated";
import { CurrentUserDto } from "../users/dtos";
import {
    FilterShipmentDto,
    AddShipmentGoodsDto,
    UpdateShipmentGoodsDto,
    RemoveShipmentGoodsDto,
} from "./dtos";

@Injectable()
export class ShipmentService {
    constructor(private readonly prisma: PrismaService) {}

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

    // ==================== ShipmentGoods Management ====================

    async addGoods(
        shipmentId: string,
        goods: AddShipmentGoodsDto[],
        user: CurrentUserDto,
    ): Promise<ShipmentEntity> {
        // Verify shipment exists and belongs to user's company
        const shipment = await this.findOne(shipmentId, user);

        // Verify all content items exist and belong to user's company
        const contentIds = goods.map((g) => g.contentId);
        const contents = await this.prisma.content.findMany({
            where: {
                id: { in: contentIds },
                companyId: user.companyId,
            },
        });

        if (contents.length !== contentIds.length) {
            throw new NotFoundException(
                "One or more content items not found in your company",
            );
        }

        // Get the shipment's currency for default unitCurrency
        const currency = await this.prisma.currency.findUnique({
            where: { id: shipment.currencyId },
        });

        // Create shipment goods entries
        await this.prisma.shipmentGoods.createMany({
            data: goods.map((g) => ({
                shipmentId,
                contentId: g.contentId,
                quantity: g.quantity || 1,
                unitPrice: g.unitPrice || 0,
                unitCurrency: g.unitCurrency || currency?.id || "USD",
                totalWeight: g.totalWeight || 0,
                totalVolume: g.totalVolume || 0,
                details: {},
            })),
            skipDuplicates: true,
        });

        // Recalculate totals and return updated shipment
        return this.recalculateTotals(shipmentId, user);
    }

    async updateGoods(
        shipmentId: string,
        data: UpdateShipmentGoodsDto,
        user: CurrentUserDto,
    ): Promise<ShipmentEntity> {
        // Verify shipment exists and belongs to user's company
        await this.findOne(shipmentId, user);

        // Verify the shipment goods entry exists
        const existingGoods = await this.prisma.shipmentGoods.findUnique({
            where: {
                shipmentId_contentId: {
                    shipmentId,
                    contentId: data.contentId,
                },
            },
        });

        if (!existingGoods) {
            throw new NotFoundException(
                `Goods with content ID ${data.contentId} not found in shipment`,
            );
        }

        // Update the shipment goods entry
        await this.prisma.shipmentGoods.update({
            where: {
                shipmentId_contentId: {
                    shipmentId,
                    contentId: data.contentId,
                },
            },
            data: {
                quantity: data.quantity ?? existingGoods.quantity,
                unitPrice: data.unitPrice ?? existingGoods.unitPrice,
                unitCurrency: data.unitCurrency ?? existingGoods.unitCurrency,
                totalWeight: data.totalWeight ?? existingGoods.totalWeight,
                totalVolume: data.totalVolume ?? existingGoods.totalVolume,
            },
        });

        // Recalculate totals and return updated shipment
        return this.recalculateTotals(shipmentId, user);
    }

    async removeGoods(
        shipmentId: string,
        data: RemoveShipmentGoodsDto,
        user: CurrentUserDto,
    ): Promise<ShipmentEntity> {
        // Verify shipment exists and belongs to user's company
        await this.findOne(shipmentId, user);

        // Delete the shipment goods entry
        try {
            await this.prisma.shipmentGoods.delete({
                where: {
                    shipmentId_contentId: {
                        shipmentId,
                        contentId: data.contentId,
                    },
                },
            });
        } catch {
            throw new NotFoundException(
                `Goods with content ID ${data.contentId} not found in shipment`,
            );
        }

        // Recalculate totals and return updated shipment
        return this.recalculateTotals(shipmentId, user);
    }

    async getShipmentGoods(
        shipmentId: string,
        user: CurrentUserDto,
    ): Promise<ShipmentGoodsEntity[]> {
        // Verify shipment exists and belongs to user's company
        await this.findOne(shipmentId, user);

        return this.prisma.shipmentGoods.findMany({
            where: { shipmentId },
            include: {
                content: true,
                shipment: true,
            },
            orderBy: { createdAt: "asc" },
        });
    }

    // ==================== Totals Calculation ====================

    async recalculateTotals(
        shipmentId: string,
        user: CurrentUserDto,
    ): Promise<ShipmentEntity> {
        // Get all goods for this shipment
        const shipmentGoods = await this.prisma.shipmentGoods.findMany({
            where: { shipmentId },
        });

        // Calculate subtotal from all goods
        const subtotal = shipmentGoods.reduce((sum, goods) => {
            return sum + goods.unitPrice * goods.quantity;
        }, 0);

        // Get current shipment to preserve discount and tax rates
        const currentShipment = await this.prisma.shipment.findUnique({
            where: { id: shipmentId },
        });

        const discount = currentShipment?.discount || 0;
        const tax = currentShipment?.tax || 0;

        // Calculate total: subtotal - discount + tax
        const total = subtotal - discount + tax;

        // Update shipment with new totals
        return this.prisma.shipment.update({
            where: { id: shipmentId },
            data: {
                subtotal,
                total,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }

    // ==================== Driver Assignment ====================

    async assignDriver(
        shipmentId: string,
        driverId: string | null,
        user: CurrentUserDto,
    ): Promise<ShipmentEntity> {
        // Verify shipment exists and belongs to user's company
        await this.findOne(shipmentId, user);

        // If assigning a driver, verify the driver exists and belongs to user's company
        if (driverId) {
            const driver = await this.prisma.user.findFirst({
                where: { id: driverId, companyId: user.companyId },
            });

            if (!driver) {
                throw new NotFoundException(
                    `Driver with ID ${driverId} not found in your company`,
                );
            }
        }

        return this.prisma.shipment.update({
            where: { id: shipmentId, companyId: user.companyId },
            data: {
                driverId,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }

    // ==================== Status Management ====================

    async updateStatus(
        shipmentId: string,
        status: string,
        user: CurrentUserDto,
    ): Promise<ShipmentEntity> {
        // Verify shipment exists and belongs to user's company
        await this.findOne(shipmentId, user);

        return this.prisma.shipment.update({
            where: { id: shipmentId, companyId: user.companyId },
            data: {
                status: status as any,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }

    // ==================== Company Participants ====================

    async assignParticipants(
        shipmentId: string,
        participants: {
            customerId?: string | null;
            supplierId?: string | null;
            logisticsId?: string | null;
        },
        user: CurrentUserDto,
    ): Promise<ShipmentEntity> {
        // Verify shipment exists and belongs to user's company
        await this.findOne(shipmentId, user);

        // Verify each company exists if provided
        const companyIds = [
            participants.customerId,
            participants.supplierId,
            participants.logisticsId,
        ].filter((id): id is string => id !== null && id !== undefined);

        if (companyIds.length > 0) {
            const companies = await this.prisma.company.findMany({
                where: { id: { in: companyIds } },
            });

            if (companies.length !== companyIds.length) {
                throw new NotFoundException("One or more companies not found");
            }
        }

        return this.prisma.shipment.update({
            where: { id: shipmentId, companyId: user.companyId },
            data: {
                customerId: participants.customerId,
                supplierId: participants.supplierId,
                logisticsId: participants.logisticsId,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }
}
