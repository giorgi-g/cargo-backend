import { Injectable, UseGuards } from "@nestjs/common";
import { PageService } from "./page.service";
import { PageEntity, CreatePageDto, UpdatePageDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { CurrentUser } from "../users/decorators/user.decorator";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";

@Injectable()
@Resolver(() => PageEntity)
export class PageResolver {
    constructor(private readonly pageService: PageService) {}

    @Mutation(() => PageEntity)
    @UseGuards(GqlAuthGuard)
    createPage(
        @Args("request") request: CreatePageDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.pageService.create(request, user);
    }

    @Query(() => [PageEntity])
    @UseGuards(GqlAuthGuard)
    findPages(@CurrentUser() user: CurrentUserDto) {
        return this.pageService.findAll(user);
    }

    @Query(() => PageEntity)
    @UseGuards(GqlAuthGuard)
    findPageById(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.pageService.findOne(id, user);
    }

    @Mutation(() => PageEntity)
    @UseGuards(GqlAuthGuard)
    updatePage(
        @Args("id") id: string,
        @Args("request") request: UpdatePageDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.pageService.update(id, request, user);
    }

    @Mutation(() => PageEntity)
    @UseGuards(GqlAuthGuard)
    deletePage(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.pageService.remove(id, user);
    }
}
