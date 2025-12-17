import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ContentEntity } from "@generated";
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
                details: data.details
                    ? JSON.stringify(data.details)
                    : undefined,
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
            companyId: user.companyId,
            langId: request.langId,
            contentType: request.contentType,
            deletedAt: null,
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
            where.pageContents = {
                some: {
                    pageId: {
                        in: request.pageIds,
                    },
                },
            };
        }

        if (request?.startDate != null) {
            where.startDate = {
                gte: new Date(request.startDate),
            };
        }

        if (request?.endDate != null) {
            where.endDate = {
                lte: new Date(request.endDate),
            };
        }

        if (request?.title != null) {
            where.title = {
                contains: request.title,
                mode: "insensitive",
            };
        }

        if (request?.slug != null) {
            where.slug = {
                contains: request.slug,
                mode: "insensitive",
            };
        }

        if (request?.cargoType != null) {
            where.cargoType = request.cargoType;
        }

        if (request?.hazardClass != null) {
            where.hazardClass = request.hazardClass;
        }

        if (request?.isPublic != null) {
            where.isPublic = request.isPublic;
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
                companyId: user.companyId,
                langId,
                deletedAt: null,
            },
        });

        if (!response) {
            return null;
        }

        let details: ContentDetailsDto | null = null;
        try {
            if (response?.details) {
                details =
                    typeof response.details === "string"
                        ? JSON.parse(response.details)
                        : (response.details as ContentDetailsDto);
            }
        } catch {
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
                details: data.details
                    ? JSON.stringify(data.details)
                    : undefined,
                updatedBy: user.id,
            },
        });
    }

    // Soft delete content
    async remove(id: string, user: CurrentUserDto): Promise<ContentEntity> {
        return this.prisma.content.update({
            where: { id, companyId: user.companyId },
            data: {
                deletedAt: new Date(),
                updatedBy: user.id,
            },
        });
    }

    async count(companyId: string, contentType: ContentType): Promise<number> {
        return this.prisma.content.count({
            where: { contentType, companyId, deletedAt: null },
        });
    }
}
