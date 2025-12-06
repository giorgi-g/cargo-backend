import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Query,
    Delete,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from "@nestjs/common";
import { FileService } from "./file.service";
import { CreateFileDto, FileResponse, UpdateFileDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { CurrentUser } from "../users/decorators/user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileType } from "src/prisma-client";

@Controller("files")
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post("/file")
    @UseInterceptors(FileInterceptor("file"))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createFileDto: CreateFileDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        if (!file) {
            throw new BadRequestException({
                field: "file",
                message: "File is required",
            });
        }

        return this.fileService.upload(file, createFileDto, user);
    }

    @Get("/files")
    findAll(
        @Query("page") page: number,
        @Query("size") size: number,
        @CurrentUser() user: CurrentUserDto,
        @Query("id") id?: string,
        @Query("type") type?: FileType,
        @Query("name") name?: string,
        @Query("extension") extension?: string,
        @Query("mime") mime?: string,
        @Query("url") url?: string,
        @Query("userId") userId?: string,
        @Query("key") key?: string,
        @Query("companyId") companyId?: string,
        @Query("folderId") folderId?: number,
        @Query("folderIdList") folderIdList?: number[],
    ): Promise<FileResponse> {
        if (userId != null && user.id !== userId) {
            userId = user.id;
        }

        return this.fileService.findAll(
            user,
            {
                page,
                size,
                id,
                type,
                name,
                extension,
                mime,
                url,
                key,
                companyId,
                folderId,
                folderIdList,
            },
            userId,
        );
    }

    @Get("/file/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.fileService.findOne(id, user);
    }

    @Put("/file/:id")
    update(
        @Param("id") id: string,
        @Body() updateFileDto: UpdateFileDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.fileService.update(id, updateFileDto, user);
    }

    @Delete("/file/:id")
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.fileService.remove(id, user);
    }
}
