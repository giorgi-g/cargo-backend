import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    CreateOrderDto,
    OrderEntity,
    OrderInput,
    OrderResponse,
    UpdateOrderDto,
} from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { pagination } from "@utils";

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
            },
        });
    }

    async findAll(
        user: CurrentUserDto,
        request: OrderInput,
    ): Promise<OrderResponse> {
        const page = Number(request.page) || 1;
        const size = Number(request.size) || 10;
        const { skip, take } = pagination(request);

        const where: any = {
            companyId: user.companyId,

            // simple filters (you can expand with all those *List and range fields if you like)
            ...(request.id && { id: request.id }),
            ...(request.idList && { id: { in: request.idList } }),
            ...(request.status && { status: request.status }),
            ...(request.statusList && { status: { in: request.statusList } }),
            ...(request.userId && { userId: request.userId }),
            ...(request.userIdList && { userId: { in: request.userIdList } }),
            ...(request.currencyId && { currencyId: request.currencyId }),
            ...(request.currencyIdList && {
                currencyId: { in: request.currencyIdList },
            }),
        };

        const [content, totalItems] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    user: true,
                    company: true,
                    currency: true,
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
        return this.prisma.order.findFirst({
            where: { id, companyId: user.companyId },
            include: {
                user: true,
                company: true,
                currency: true,
            },
        });
    }

    async update(
        id: string,
        data: UpdateOrderDto,
        user: CurrentUserDto,
    ): Promise<OrderEntity> {
        return this.prisma.order.update({
            where: { id },
            data: {
                ...data,
                updatedBy: user.id,
            },
            include: {
                user: true,
                company: true,
                currency: true,
            },
        });
    }

    async remove(id: string, user: CurrentUserDto): Promise<OrderEntity> {
        return this.prisma.order.delete({
            where: { id, companyId: user.companyId },
            include: {
                user: true,
                company: true,
                currency: true,
            },
        });
    }
}
