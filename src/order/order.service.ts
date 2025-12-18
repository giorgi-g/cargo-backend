import {
    Injectable,
    NotFoundException,
    OnModuleDestroy,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    CreateOrderDto,
    OrderEntity,
    OrderResponse,
    UpdateOrderDto,
    OrderShipmentEntity,
} from "@generated";
import { CurrentUserDto } from "../users/dtos";
import {
    FilterOrderDto,
    AddOrderShipmentDto,
    UpdateOrderShipmentDto,
    RemoveOrderShipmentDto,
} from "./dtos";

@Injectable()
export class OrderService implements OnModuleDestroy {
    constructor(private readonly prisma: PrismaService) {}

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

    private readonly includeRelations = {
        user: true,
        company: true,
        currency: true,
        orderShipments: {
            include: {
                shipment: {
                    include: {
                        shipmentGoods: {
                            include: {
                                content: true,
                            },
                        },
                        departure: true,
                        arrival: true,
                        driver: true,
                        customerCompany: true,
                        supplierCompany: true,
                        logisticsCompany: true,
                    },
                },
            },
            orderBy: {
                position: "asc" as const,
            },
        },
    };

    async create(
        data: CreateOrderDto,
        user: CurrentUserDto,
    ): Promise<OrderEntity> {
        return this.prisma.order.create({
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
        request: FilterOrderDto,
    ): Promise<OrderResponse> {
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

        if (request.userId) {
            where.userId = request.userId;
        }

        if (request.currencyId) {
            where.currencyId = request.currencyId;
        }

        if (request.paymentMethod) {
            where.paymentMethod = request.paymentMethod;
        }

        if (request.startDate) {
            where.createdAt = {
                ...where.createdAt,
                gte: new Date(request.startDate),
            };
        }

        if (request.endDate) {
            where.createdAt = {
                ...where.createdAt,
                lte: new Date(request.endDate),
            };
        }

        if (request.notes) {
            where.notes = {
                contains: request.notes,
                mode: "insensitive",
            };
        }

        const [content, totalItems] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: size,
                orderBy: { createdAt: "desc" },
                include: this.includeRelations,
            }),
            this.prisma.order.count({ where }),
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
    ): Promise<OrderEntity | null> {
        const order = await this.prisma.order.findFirst({
            where: { id, companyId: user.companyId },
            include: this.includeRelations,
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return order;
    }

    async update(
        id: string,
        data: UpdateOrderDto,
        user: CurrentUserDto,
    ): Promise<OrderEntity> {
        // Verify order exists and belongs to user's company
        await this.findOne(id, user);

        return this.prisma.order.update({
            where: { id, companyId: user.companyId },
            data: {
                ...data,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }

    async remove(id: string, user: CurrentUserDto): Promise<OrderEntity> {
        // Verify order exists and belongs to user's company
        await this.findOne(id, user);

        return this.prisma.order.delete({
            where: { id, companyId: user.companyId },
            include: this.includeRelations,
        });
    }

    // ==================== OrderShipment Management ====================

    async addShipments(
        orderId: string,
        shipments: AddOrderShipmentDto[],
        user: CurrentUserDto,
    ): Promise<OrderEntity> {
        // Verify order exists and belongs to user's company
        await this.findOne(orderId, user);

        // Verify all shipments exist and belong to user's company
        const shipmentIds = shipments.map((s) => s.shipmentId);
        const existingShipments = await this.prisma.shipment.findMany({
            where: {
                id: { in: shipmentIds },
                companyId: user.companyId,
            },
        });

        if (existingShipments.length !== shipmentIds.length) {
            throw new NotFoundException(
                "One or more shipments not found in your company",
            );
        }

        // Get current max position for this order
        const currentMax = await this.prisma.orderShipment.aggregate({
            where: { orderId },
            _max: { position: true },
        });
        let nextPosition = (currentMax._max?.position || 0) + 1;

        // Create order shipment entries
        await this.prisma.orderShipment.createMany({
            data: shipments.map((s, index) => ({
                orderId,
                shipmentId: s.shipmentId,
                position: s.position ?? nextPosition + index,
                details: {},
            })),
            skipDuplicates: true,
        });

        // Recalculate totals and return updated order
        return this.recalculateTotals(orderId, user);
    }

    async updateShipmentPosition(
        orderId: string,
        data: UpdateOrderShipmentDto,
        user: CurrentUserDto,
    ): Promise<OrderEntity> {
        // Verify order exists and belongs to user's company
        await this.findOne(orderId, user);

        // Verify the order shipment entry exists
        const existingOrderShipment = await this.prisma.orderShipment.findUnique({
            where: {
                orderId_shipmentId: {
                    orderId,
                    shipmentId: data.shipmentId,
                },
            },
        });

        if (!existingOrderShipment) {
            throw new NotFoundException(
                `Shipment with ID ${data.shipmentId} not found in order`,
            );
        }

        // Update the position
        await this.prisma.orderShipment.update({
            where: {
                orderId_shipmentId: {
                    orderId,
                    shipmentId: data.shipmentId,
                },
            },
            data: {
                position: data.position,
            },
        });

        return this.findOne(orderId, user);
    }

    async removeShipment(
        orderId: string,
        data: RemoveOrderShipmentDto,
        user: CurrentUserDto,
    ): Promise<OrderEntity> {
        // Verify order exists and belongs to user's company
        await this.findOne(orderId, user);

        // Delete the order shipment entry
        try {
            await this.prisma.orderShipment.delete({
                where: {
                    orderId_shipmentId: {
                        orderId,
                        shipmentId: data.shipmentId,
                    },
                },
            });
        } catch {
            throw new NotFoundException(
                `Shipment with ID ${data.shipmentId} not found in order`,
            );
        }

        // Recalculate totals and return updated order
        return this.recalculateTotals(orderId, user);
    }

    async getOrderShipments(
        orderId: string,
        user: CurrentUserDto,
    ): Promise<OrderShipmentEntity[]> {
        // Verify order exists and belongs to user's company
        await this.findOne(orderId, user);

        return this.prisma.orderShipment.findMany({
            where: { orderId },
            include: {
                order: true,
                shipment: {
                    include: {
                        shipmentGoods: {
                            include: {
                                content: true,
                            },
                        },
                        departure: true,
                        arrival: true,
                    },
                },
            },
            orderBy: { position: "asc" },
        });
    }

    // ==================== Totals Calculation ====================

    async recalculateTotals(
        orderId: string,
        user: CurrentUserDto,
    ): Promise<OrderEntity> {
        // Get all shipments for this order
        const orderShipments = await this.prisma.orderShipment.findMany({
            where: { orderId },
            include: {
                shipment: true,
            },
        });

        // Calculate subtotal from all shipments
        const subtotal = orderShipments.reduce((sum, os) => {
            return sum + (os.shipment?.total || 0);
        }, 0);

        // Get current order to preserve discount and tax rates
        const currentOrder = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        const discount = currentOrder?.discount || 0;
        const tax = currentOrder?.tax || 0;

        // Calculate total: subtotal - discount + tax
        const total = subtotal - discount + tax;

        // Update order with new totals
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                subtotal,
                total,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }

    // ==================== Status Management ====================

    async updateStatus(
        orderId: string,
        status: string,
        user: CurrentUserDto,
    ): Promise<OrderEntity> {
        // Verify order exists and belongs to user's company
        await this.findOne(orderId, user);

        return this.prisma.order.update({
            where: { id: orderId, companyId: user.companyId },
            data: {
                status: status as any,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }

    // ==================== Payment Processing ====================

    async processPayment(
        orderId: string,
        paymentMethod: string,
        paymentRef: string | null,
        user: CurrentUserDto,
    ): Promise<OrderEntity> {
        // Verify order exists and belongs to user's company
        await this.findOne(orderId, user);

        return this.prisma.order.update({
            where: { id: orderId, companyId: user.companyId },
            data: {
                paymentMethod: paymentMethod as any,
                paymentRef,
                updatedBy: user.id,
            },
            include: this.includeRelations,
        });
    }
}
