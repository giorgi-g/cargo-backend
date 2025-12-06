import { Injectable, UseGuards } from "@nestjs/common";
import { PackageService } from "./package.service";
import { PackageEntity, CreatePackageDto, UpdatePackageDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { CurrentUser } from "../users/decorators/user.decorator";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";

@Injectable()
@Resolver(() => PackageEntity)
export class PackageResolver {
    constructor(private readonly packageService: PackageService) {}

    @Mutation(() => PackageEntity)
    @UseGuards(GqlAuthGuard)
    createPackage(
        @Args("request") request: CreatePackageDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.packageService.create(request, user);
    }

    @Query(() => [PackageEntity])
    @UseGuards(GqlAuthGuard)
    findPackages(@CurrentUser() user: CurrentUserDto) {
        return this.packageService.findAll(user);
    }

    @Query(() => PackageEntity)
    @UseGuards(GqlAuthGuard)
    findPackageById(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.packageService.findOne(id, user);
    }

    @Mutation(() => PackageEntity)
    @UseGuards(GqlAuthGuard)
    updatePackage(
        @Args("id") id: string,
        @Args("request") request: UpdatePackageDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.packageService.update(id, request, user);
    }

    @Mutation(() => PackageEntity)
    @UseGuards(GqlAuthGuard)
    deletePackage(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.packageService.remove(id, user);
    }
}
