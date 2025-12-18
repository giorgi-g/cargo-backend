import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    NotificationEntity,
    NotificationResponse,
    CreateNotificationDto,
    UpdateNotificationDto,
    NotificationInput,
} from "@generated";
import { CurrentUserDto } from "../users/dtos";

@Injectable()
export class NotificationService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        data: CreateNotificationDto,
        user: CurrentUserDto,
    ): Promise<NotificationEntity> {
        return this.prisma.notification.create({
            data: {
                ...data,
                companyId: user.companyId,
                data: {},
            },
            include: {
                user: true,
                company: true,
            },
        });
    }

    async findAll(
        user: CurrentUserDto,
        request: NotificationInput,
    ): Promise<NotificationResponse> {
        const page = Number(request.page) || 1;
        const size = Number(request.size) || 10;
        const skip = (page - 1) * size;

        const where: any = {
            companyId: user.companyId,
            userId: user.id,
        };

        if (request.type) {
            where.type = request.type;
        }

        if (request.isRead !== undefined && request.isRead !== null) {
            where.isRead = request.isRead;
        }

        if (request.refType) {
            where.refType = request.refType;
        }

        if (request.refId) {
            where.refId = request.refId;
        }

        const [content, totalItems] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                skip,
                take: size,
                orderBy: { createdAt: "desc" },
                include: {
                    user: true,
                    company: true,
                },
            }),
            this.prisma.notification.count({ where }),
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
    ): Promise<NotificationEntity | null> {
        return this.prisma.notification.findFirst({
            where: {
                id,
                companyId: user.companyId,
                userId: user.id,
            },
            include: {
                user: true,
                company: true,
            },
        });
    }

    async findUnreadCount(user: CurrentUserDto): Promise<number> {
        return this.prisma.notification.count({
            where: {
                companyId: user.companyId,
                userId: user.id,
                isRead: false,
            },
        });
    }

    async markAsRead(
        id: string,
        user: CurrentUserDto,
    ): Promise<NotificationEntity> {
        return this.prisma.notification.update({
            where: {
                id,
                companyId: user.companyId,
                userId: user.id,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
            include: {
                user: true,
                company: true,
            },
        });
    }

    async markAllAsRead(user: CurrentUserDto): Promise<{ count: number }> {
        const result = await this.prisma.notification.updateMany({
            where: {
                companyId: user.companyId,
                userId: user.id,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return { count: result.count };
    }

    async remove(
        id: string,
        user: CurrentUserDto,
    ): Promise<NotificationEntity> {
        return this.prisma.notification.delete({
            where: {
                id,
                companyId: user.companyId,
                userId: user.id,
            },
            include: {
                user: true,
                company: true,
            },
        });
    }

    async removeAll(user: CurrentUserDto): Promise<{ count: number }> {
        const result = await this.prisma.notification.deleteMany({
            where: {
                companyId: user.companyId,
                userId: user.id,
            },
        });

        return { count: result.count };
    }
}
