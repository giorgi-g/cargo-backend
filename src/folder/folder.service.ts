import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFolderDto, FolderEntity, UpdateFolderDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";

@Injectable()
export class FolderService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        data: CreateFolderDto,
        { companyId, id }: CurrentUserDto,
    ): Promise<FolderEntity> {
        return this.prisma.folder.create({
            data: {
                ...data,
                companyId,
                createdBy: id,
                updatedBy: id,
            },
        });
    }

    async findAll({ companyId }: CurrentUserDto): Promise<FolderEntity[]> {
        return this.prisma.folder.findMany({
            where: { companyId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findOne(
        id: number,
        { companyId }: CurrentUserDto,
    ): Promise<FolderEntity | null> {
        return this.prisma.folder.findUnique({
            where: { id, companyId },
        });
    }

    async update(
        id: number,
        data: UpdateFolderDto,
        { companyId }: CurrentUserDto,
    ): Promise<FolderEntity> {
        return this.prisma.folder.update({
            where: { id, companyId },
            data,
        });
    }

    async updateFolders(
        folders: FolderEntity[],
        { companyId, id }: CurrentUserDto,
    ): Promise<FolderEntity[]> {
        const updates = folders.map((folder) =>
            this.prisma.folder.update({
                where: {
                    id: folder.id,
                    companyId,
                },
                data: {
                    name: folder.name,
                    lft: folder.lft,
                    rgt: folder.rgt,
                    depth: folder.depth,
                    parentId: folder.parentId === 0 ? null : folder.parentId,
                    updatedBy: id,
                },
            }),
        );

        return Promise.all(updates);
    }

    async remove(
        id: number,
        { companyId }: CurrentUserDto,
    ): Promise<FolderEntity> {
        return this.prisma.folder.delete({
            where: { id, companyId },
        });
    }
}
