import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTransportFilesDto } from "@generated";
import { FileEntityInput } from "../file/types";

@Injectable()
export class TransportFilesService {
    constructor(private readonly prisma: PrismaService) {}

    async create({ fileId, transportId }: CreateTransportFilesDto) {
        return this.prisma.transportFiles.create({
            data: { fileId, transportId },
        });
    }

    async findByTransportId(transportId: string) {
        return this.prisma.transportFiles.findMany({
            where: { transportId },
        });
    }

    async createMany(transportId: string, fileIds: string[]) {
        const data = [];

        fileIds.forEach((fileId) => {
            data.push({
                transportId,
                fileId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });

        return this.prisma.transportFiles.createMany({
            data,
            skipDuplicates: true,
        });
    }

    async deleteMany(transportId: string, fileIds: string[]) {
        return await this.prisma.transportFiles.deleteMany({
            where: { transportId, fileId: { in: fileIds } },
        });
    }

    async sync(transportId: string, files: FileEntityInput[]) {
        const currentFiles = await this.findByTransportId(transportId);

        const idsToDelete: string[] = [];
        const idsToCreate: string[] = [];

        currentFiles.forEach((file) => {
            const currentFile = files.find((x) => x.id === file.fileId);

            if (!currentFile) {
                idsToDelete.push(file.fileId);
            }
        });

        files.forEach((file) => {
            const currentFile = currentFiles.find((x) => x.fileId === file.id);
            if (!currentFile) {
                idsToCreate.push(file.id);
            }
        });

        if (idsToDelete.length > 0) {
            await this.deleteMany(transportId, idsToDelete);
        }

        if (idsToCreate.length > 0) {
            await this.createMany(transportId, idsToCreate);
        }
    }
}
