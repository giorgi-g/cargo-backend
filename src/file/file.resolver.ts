import { Injectable, UseGuards } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileEntity, FileInput, FileResponse, UpdateFileDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { CurrentUser } from "../users/decorators/user.decorator";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

@Injectable()
@Resolver(() => FileResponse)
export class FileResolver {
    constructor(private readonly fileService: FileService) {}

    @Query(() => FileResponse)
    findFiles(
        @CurrentUser() user: CurrentUserDto,
        @Args("request") request: FileInput,
    ): Promise<FileResponse> {
        return this.fileService.findAll(user, request);
    }

    @Query(() => [FileEntity])
    findFileById(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.fileService.findOne(id, user);
    }

    @Mutation(() => FileEntity)
    updateFile(
        @Args("id") id: string,
        @Args("request") request: UpdateFileDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.fileService.update(id, request, user);
    }

    @Mutation(() => FileEntity)
    deleteFile(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.fileService.remove(id, user);
    }
}
