import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    CreateFileDto,
    FileEntity,
    FileInput,
    FileResponse,
    UpdateFileDto,
} from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { ConfigService } from "@nestjs/config";
import { InjectS3, S3 } from "nestjs-s3";
import { getFileType, pagination, slug } from "@utils";

@Injectable()
export class FileService implements OnModuleDestroy {
    private readonly bucketName: string;
    private readonly region: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @InjectS3() private readonly s3: S3,
    ) {
        this.bucketName = this.configService.get("S3_BUCKET_NAME");
        this.region = this.configService.get("S3_BUCKET_REGION");
    }

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

    async findByIdIn(ids: string[]): Promise<FileEntity[]> {
        return this.prisma.file.findMany({
            where: {
                id: { in: ids },
            },
        });
    }

    async findAll(
        user: CurrentUserDto,
        request: FileInput,
        userId?: string,
    ): Promise<FileResponse> {
        const { skip, take } = pagination(request);

        const where = {
            companyId: user.companyId,
            ...(request.name && { name: { contains: request.name } }),
            ...(request.folderId && { folderId: request.folderId }),
            ...(request.typeList && { ["type"]: { in: request.typeList } }),
            ...(userId && { userId }),
            ...(request.folderIdList && {
                folderId: { in: request.folderIdList },
            }),
        };

        const [content, totalItems] = await Promise.all([
            this.prisma.file.findMany({
                where,
                skip,
                take,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            this.prisma.file.count({
                where,
            }),
        ]);

        return {
            content,
            totalItems,
            size: request.size,
            page: request.page,
            totalPages: Math.ceil(totalItems / request.size),
        };
    }

    async findOne(
        id: string,
        user: CurrentUserDto,
    ): Promise<FileEntity | null> {
        return this.prisma.file.findFirst({
            where: { id, userId: user.id },
        });
    }

    async update(
        id: string,
        data: UpdateFileDto,
        user: CurrentUserDto,
    ): Promise<FileEntity> {
        return this.prisma.file.updateMany({
            where: { id, userId: user.id },
            data: {
                folderId: data.folderId,
            },
        }) as unknown as FileEntity;
    }

    async remove(id: string, user: CurrentUserDto): Promise<FileEntity> {
        const file = await this.prisma.file.findFirst({
            where: { id, userId: user.id },
        });

        if (file) {
            await this.s3.deleteObject({
                Bucket: this.bucketName,
                Key: file.key,
            });
        }

        return this.prisma.file.delete({
            where: { id, userId: user.id },
        });
    }

    async upload(
        file: Express.Multer.File,
        data: CreateFileDto,
        user: CurrentUserDto,
    ): Promise<FileEntity | null> {
        try {
            const userId = user.id;
            const [, extension] = file.originalname.split(".");
            const name = slug(data.name);

            const key = `${userId}/${Date.now()}-${name}.${extension}`;

            await this.s3.putObject({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read",
            });

            const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${this.bucketName}/${key}`;
            const type = getFileType(extension);

            const fileEntity = await this.prisma.file.create({
                data: {
                    type,
                    size: `${file.size}`,
                    name: `${name}.${extension}`,
                    extension,
                    mime: file.mimetype,
                    userId,
                    url,
                    key,
                    companyId: `${user.companyId}`,
                    folderId: data.folderId,
                    createdAt: new Date(),
                },
            });

            console.log(">>> file entity", fileEntity);

            return fileEntity;
        } catch (error) {
            console.log(">>>> error", error.message);

            return null;
        }
    }

    async count(companyId: string): Promise<number> {
        return this.prisma.file.count({
            where: { companyId },
        });
    }
}
