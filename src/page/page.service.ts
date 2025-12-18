import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePageDto, PageEntity, UpdatePageDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";

@Injectable()
export class PageService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        data: CreatePageDto,
        user: CurrentUserDto,
    ): Promise<PageEntity> {
        const page = await this.prisma.page.create({
            data: {
                ...data,
                companyId: user.companyId,
                position: data.position,
                createdBy: user.id,
                updatedBy: user.id,
            },
        });

        if (data.pageId == null) {
            await this.update(page.id, { ...page, pageId: page.id }, user);
        }

        return page;
    }

    async findAll(user: CurrentUserDto): Promise<PageEntity[]> {
        return this.prisma.page.findMany({
            where: { createdBy: user.id, companyId: user.companyId },
        });
    }

    async findOne(
        id: string,
        user: CurrentUserDto,
    ): Promise<PageEntity | null> {
        return this.prisma.page.findFirst({
            where: { id, createdBy: user.id, companyId: user.companyId },
        });
    }

    async update(
        id: string,
        data: UpdatePageDto,
        user: CurrentUserDto,
    ): Promise<PageEntity> {
        return this.prisma.page.update({
            where: { id, companyId: user.companyId },
            data: {
                ...data,
                updatedBy: user.id,
            },
        });
    }

    async remove(id: string, user: CurrentUserDto): Promise<PageEntity> {
        return this.prisma.page.delete({
            where: { id, companyId: user.companyId },
        });
    }
}
