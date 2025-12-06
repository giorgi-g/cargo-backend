import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TransportEntity, TransportInput } from "@generated";
import { CreateTransportInput, UpdateTransportInput } from "./types";
import { TransportFilesService } from "./transport-files.service";
import { convertBigIntegers } from "@utils";
import { CurrentUserDto } from "../users/dtos";

@Injectable()
export class TransportService {
    constructor(
        private readonly transportFilesService: TransportFilesService,
        private readonly prisma: PrismaService,
    ) {}

    async create(
        userId: string,
        { fileIds, ...data }: CreateTransportInput,
        user: CurrentUserDto,
    ) {
        const transport = await this.prisma.transport.create({
            data: {
                ...data,
                userId,
                companyId: user.companyId,
            },
        });

        if (transport.id && fileIds?.length > 0) {
            await this.transportFilesService.createMany(
                transport.id,
                fileIds.map((x) => x.id),
            );
        }

        return transport;
    }

    findAll(input: TransportInput): Promise<TransportEntity[]> {
        return this.prisma.transport.findMany({
            include: { user: true },
        });
    }

    findAllByUserId(userId: string) {
        return this.prisma.transport.findMany({
            where: { userId },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }

    async findOne(id: string): Promise<TransportEntity | null> {
        const transport = await this.prisma.transport.findUnique({
            where: { id },
            include: {
                user: true,
                transportFiles: {
                    select: {
                        fileId: true,
                        transportId: true,
                        createdAt: true,
                        updatedAt: true,
                        file: true,
                    },
                },
            },
        });

        transport.transportFiles =
            convertBigIntegers(transport.transportFiles) || [];

        return transport;
    }

    async update(id: string, { fileIds, ...data }: UpdateTransportInput) {
        const transport = await this.prisma.transport.update({
            where: { id },
            data,
        });

        if (transport?.id && fileIds.length > 0) {
            await this.transportFilesService.sync(transport.id, fileIds);
        }

        return transport;
    }

    remove(id: string) {
        return this.prisma.transport.delete({
            where: { id },
        });
    }
}
