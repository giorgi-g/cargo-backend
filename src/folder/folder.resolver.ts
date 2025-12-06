import { Injectable, UseGuards } from "@nestjs/common";
import { FolderService } from "./folder.service";
import { CreateFolderDto, FolderEntity, UpdateFolderDto } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";

@Injectable()
@Resolver(() => FolderEntity)
export class FolderResolver {
    constructor(private readonly folderService: FolderService) {}

    @Mutation(() => FolderEntity)
    @UseGuards(GqlAuthGuard)
    createFolder(
        @CurrentUser() user: CurrentUserDto,
        @Args("request") request: CreateFolderDto,
    ) {
        return this.folderService.create(request, user);
    }

    @Query(() => [FolderEntity])
    @UseGuards(GqlAuthGuard)
    findFolders(@CurrentUser() user: CurrentUserDto) {
        return this.folderService.findAll(user);
    }

    @Query(() => FolderEntity)
    @UseGuards(GqlAuthGuard)
    findFolderById(
        @CurrentUser() user: CurrentUserDto,
        @Args("id") id: number,
    ) {
        return this.folderService.findOne(id, user);
    }

    @Mutation(() => FolderEntity)
    @UseGuards(GqlAuthGuard)
    updateFolder(
        @CurrentUser() user: CurrentUserDto,
        @Args("id") id: number,
        @Args("request") request: UpdateFolderDto,
    ) {
        return this.folderService.update(id, request, user);
    }

    @Mutation(() => FolderEntity)
    @UseGuards(GqlAuthGuard)
    deleteFolder(@CurrentUser() user: CurrentUserDto, @Args("id") id: number) {
        return this.folderService.remove(id, user);
    }
}
