import { Injectable, UseGuards } from "@nestjs/common";
import { CompanyService } from "./company.service";
import {
    CompanyEntity,
    CreateCompanyDto,
    RoleEnum,
    UpdateCompanyDto,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { Roles } from "../authorization/roles/decorators";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";

@Injectable()
@Resolver(() => CompanyEntity)
export class CompanyResolver {
    constructor(private readonly companyService: CompanyService) {}

    @Mutation(() => CompanyEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    createCompany(
        @CurrentUser() user: CurrentUserDto,
        @Args("request") request: CreateCompanyDto,
    ) {
        return this.companyService.create(request, user);
    }

    @Query(() => [CompanyEntity])
    @UseGuards(GqlAuthGuard)
    getCompanies(@CurrentUser() user: CurrentUserDto) {
        return this.companyService.findAll();
    }

    @Query(() => CompanyEntity)
    @UseGuards(GqlAuthGuard)
    getCompanyById(@Args("id") id: string) {
        return this.companyService.findOne(id);
    }

    @Mutation(() => CompanyEntity)
    @UseGuards(GqlAuthGuard)
    updateCompany(
        @CurrentUser() user: CurrentUserDto,
        @Args("id") id: string,
        @Args("request") request: UpdateCompanyDto,
    ) {
        return this.companyService.update(id, request, user);
    }

    @Mutation(() => CompanyEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    deleteCompany(@CurrentUser() user: CurrentUserDto, @Args("id") id: string) {
        return this.companyService.delete(id, user.companyId);
    }
}
