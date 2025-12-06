import { Injectable, UseGuards } from "@nestjs/common";
import { ContentService } from "./content.service";
import { ContentEntity, RoleEnum } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { Roles } from "../authorization/roles/decorators";
import {
    FilterContentDto,
    UpdateContentInput,
    CreateContentInput,
    ContentDto,
} from "./dtos";

@Injectable()
@Resolver(() => ContentEntity)
export class ContentResolver {
    constructor(private readonly contentService: ContentService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.RESERVATIONS_MANAGER,
    )
    @Mutation(() => ContentEntity)
    @UseGuards(GqlAuthGuard)
    createContent(
        @Args("request") request: CreateContentInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.contentService.create(request, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.ACCOUNTANT,
        RoleEnum.HR_MANAGER,
        RoleEnum.RESERVATIONS_MANAGER,
    )
    @Query(() => [ContentEntity])
    @UseGuards(GqlAuthGuard)
    findContents(
        @CurrentUser() user: CurrentUserDto,
        @Args("request") request: FilterContentDto,
    ) {
        return this.contentService.findAll(user, request);
    }

    @Query(() => ContentDto, { nullable: true })
    @UseGuards(GqlAuthGuard)
    findContentById(
        @CurrentUser() user: CurrentUserDto,
        @Args("id") id: string,
        @Args("langId") langId: number,
    ): Promise<ContentDto | null> {
        return this.contentService.findOne(id, user, langId);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.RESERVATIONS_MANAGER,
    )
    @Mutation(() => ContentEntity)
    @UseGuards(GqlAuthGuard)
    updateContent(
        @Args("id") id: string,
        @Args("request") request: UpdateContentInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.contentService.update(id, request, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
    )
    @Mutation(() => ContentEntity)
    @UseGuards(GqlAuthGuard)
    deleteContent(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.contentService.remove(id, user);
    }
}
