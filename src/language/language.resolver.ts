import { Injectable, UseGuards } from "@nestjs/common";
import { LanguageService } from "./language.service";
import {
    CreateLanguageDto,
    LanguageEntity,
    RoleEnum,
    UpdateLanguageDto,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos/current-user.dto";
import { Roles } from "../authorization/roles/decorators/role.decorator";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";

@Injectable()
@Resolver(() => LanguageEntity)
export class LanguageResolver {
    constructor(private readonly languageService: LanguageService) {}

    @Mutation(() => LanguageEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    createLanguage(@Args("request") request: CreateLanguageDto) {
        return this.languageService.create(request);
    }

    @Query(() => [LanguageEntity])
    @UseGuards(GqlAuthGuard)
    findLanguages(@CurrentUser() user: CurrentUserDto) {
        return this.languageService.findAll();
    }

    @Mutation(() => LanguageEntity)
    @UseGuards(GqlAuthGuard)
    findLanguageById(@Args("id") id: number) {
        return this.languageService.findOne(id);
    }

    @Mutation(() => LanguageEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    update(
        @Args("id") id: number,
        @Args("request") request: UpdateLanguageDto,
    ) {
        return this.languageService.update(id, request);
    }

    @Mutation(() => LanguageEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    deleteLanguage(@Args("id") id: number) {
        return this.languageService.remove(id);
    }
}
