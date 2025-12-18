import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { LicenseService } from "./license.service";
import { LicenseEntity, LicenseResponse, RoleEnum } from "@generated";
import {
    CreateLicenseInput,
    UpdateLicenseInput,
    FilterLicenseDto,
} from "./types";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { Roles } from "../authorization/roles/decorators";

@Resolver(() => LicenseEntity)
export class LicenseResolver {
    constructor(private readonly licenseService: LicenseService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
    )
    @Mutation(() => LicenseEntity)
    @UseGuards(GqlAuthGuard)
    createLicense(
        @Args("userId") userId: string,
        @Args("input") input: CreateLicenseInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.licenseService.create(userId, input, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.DRIVER,
    )
    @Query(() => LicenseResponse)
    @UseGuards(GqlAuthGuard)
    findLicenses(
        @Args("request") request: FilterLicenseDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.licenseService.findAll(user, request);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.DRIVER,
    )
    @Query(() => [LicenseEntity])
    @UseGuards(GqlAuthGuard)
    findLicensesByUser(
        @Args("userId") userId: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.licenseService.findLicensesByUserId(userId, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.DRIVER,
    )
    @Query(() => LicenseEntity, { nullable: true })
    @UseGuards(GqlAuthGuard)
    findLicense(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.licenseService.findOne(id, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
    )
    @Mutation(() => LicenseEntity)
    @UseGuards(GqlAuthGuard)
    updateLicense(
        @Args("id") id: string,
        @Args("input") input: UpdateLicenseInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.licenseService.update(id, input, user);
    }

    @Roles(RoleEnum.ROOT, RoleEnum.ADMIN, RoleEnum.GENERAL_MANAGER)
    @Mutation(() => LicenseEntity)
    @UseGuards(GqlAuthGuard)
    removeLicense(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.licenseService.remove(id, user);
    }
}
