import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
} from "@nestjs/common";
import { FolderService } from "./folder.service";
import { CreateFolderDto, FolderEntity, UpdateFolderDto } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";

@Controller("folders")
export class FolderController {
    constructor(private readonly folderService: FolderService) {}

    @Post("/folder")
    create(
        @CurrentUser() user: CurrentUserDto,
        @Body() request: CreateFolderDto,
    ) {
        return this.folderService.create(request, user);
    }

    @Get("/folders")
    findAll(@CurrentUser() user: CurrentUserDto) {
        return this.folderService.findAll(user);
    }

    @Get("/folder/:id")
    findOne(@CurrentUser() user: CurrentUserDto, @Param("id") id: string) {
        return this.folderService.findOne(Number(id), user);
    }

    @Put("/folder/:id")
    update(
        @CurrentUser() user: CurrentUserDto,
        @Param("id") id: string,
        @Body() updateFolderDto: UpdateFolderDto,
    ) {
        return this.folderService.update(Number(id), updateFolderDto, user);
    }

    @Put("/folders")
    updateFolders(
        @CurrentUser() user: CurrentUserDto,
        @Body() request: FolderEntity[],
    ) {
        return this.folderService.updateFolders(request, user);
    }

    @Delete("/folder/:id")
    remove(@CurrentUser() user: CurrentUserDto, @Param("id") id: string) {
        return this.folderService.remove(Number(id), user);
    }
}
