import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ContentEntity, UpdateContentDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";
import {
    ContentDetailsDto,
    ContentDto,
    CreateContentInput,
    FilterContentDto,
    UpdateContentInput,
} from "./dtos";
import { ContentType } from "src/prisma-client";

@Injectable()
export class ContentService implements OnModuleDestroy {
    constructor(private readonly prisma: PrismaService) {}

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

    // Create content
    async create(
        data: CreateContentInput,
        user: CurrentUserDto,
    ): Promise<ContentEntity> {
        const content = await this.prisma.content.create({
            data: {
                ...data,
                companyId: user.companyId,
                details: JSON.stringify(data.details),
                createdBy: user.id,
                updatedBy: user.id,
            },
        });

        if (data.itemId == null || data.itemId === "-") {
            return await this.prisma.content.update({
                where: { id: content.id, companyId: user.companyId },
                data: {
                    itemId: content.id,
                    updatedBy: user.id,
                },
            });
        }

        return content;
    }

    // Find all content
    async findAll(
        user: CurrentUserDto,
        request: FilterContentDto,
    ): Promise<ContentEntity[]> {
        const where: any = {
            createdBy: user.id,
            companyId: user.companyId,
            langId: request.langId,
            contentType: request.contentType,
        };

        if (request?.cityId != null && !isNaN(request?.cityId)) {
            where.cityId = request.cityId;
        }

        if (request?.statuses?.length) {
            where.status = {
                in: request.statuses,
            };
        }

        if (request?.pageIds?.length) {
            where.pageId = {
                in: request.pageIds,
            };
        }

        if (request?.startDate != null) {
            where.startDate = {
                gt: new Date(request.startDate),
            };
        }

        if (request?.endDate != null) {
            where.endDate = {
                lt: new Date(request.endDate),
            };
        }

        if (request?.title != null) {
            where.title = {
                contains: request.title,
                mode: "insensitive",
            };
        }

        return this.prisma.content.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
    }

    // Find one content by ID
    async findOne(
        itemId: string,
        user: CurrentUserDto,
        langId: number,
    ): Promise<ContentDto | null> {
        const response = await this.prisma.content.findFirst({
            where: {
                itemId,
                createdBy: user.id,
                companyId: user.companyId,
                langId,
            },
        });

        let details = null;
        try {
            const d: any = response?.details;
            details = JSON.parse(d) as ContentDetailsDto;
        } catch (e) {
            details = null;
        }

        return {
            ...response,
            details,
        };
    }

    // Update content
    async update(
        id: string,
        data: UpdateContentInput,
        user: CurrentUserDto,
    ): Promise<ContentEntity> {
        return this.prisma.content.update({
            where: { id, companyId: user.companyId },
            data: {
                ...data,
                details: JSON.stringify(data.details),
                updatedBy: user.id,
            },
        });
    }

    // Delete content
    async remove(id: string, user: CurrentUserDto): Promise<ContentEntity> {
        return this.prisma.content.delete({
            where: { id, companyId: user.companyId },
        });
    }

    async count(companyId: string, contentType: ContentType): Promise<number> {
        return this.prisma.content.count({ where: { contentType, companyId } });
    }
}
