import {
    Injectable,
    NotFoundException,
    OnModuleDestroy,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto, OrderEntity, OrderResponse, UpdateOrderDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { FilterOrderDto } from "./dtos";

@Injectable()
export class OrderService implements OnModuleDestroy {
    constructor(private readonly prisma: PrismaService) {}

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

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
            include: {
                user: true,
                company: true,
                currency: true,
                orderShipments: {
                    include: {
                        shipment: true,
                    },
                },
            },
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
                include: {
                    user: true,
                    company: true,
                    currency: true,
                    orderShipments: {
                        include: {
                            shipment: true,
                        },
                    },
                },
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
            include: {
                user: true,
                company: true,
                currency: true,
                orderShipments: {
                    include: {
                        shipment: true,
                    },
                },
            },
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
            include: {
                user: true,
                company: true,
                currency: true,
                orderShipments: {
                    include: {
                        shipment: true,
                    },
                },
            },
        });
    }

    async remove(id: string, user: CurrentUserDto): Promise<OrderEntity> {
        // Verify order exists and belongs to user's company
        await this.findOne(id, user);

        return this.prisma.order.delete({
            where: { id, companyId: user.companyId },
            include: {
                user: true,
                company: true,
                currency: true,
                orderShipments: {
                    include: {
                        shipment: true,
                    },
                },
            },
        });
    }
}
