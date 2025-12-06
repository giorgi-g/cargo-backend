import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { LicenseService } from "./license.service";
import { LicenseEntity } from "@generated";
import { CreateLicenseInput, UpdateLicenseInput } from "./types";

@Resolver(() => LicenseEntity)
export class LicenseResolver {
    constructor(private readonly licenseService: LicenseService) {}

    @Mutation(() => LicenseEntity)
    createLicense(
        @Args("userId") userId: string,
        @Args("input") input: CreateLicenseInput,
    ) {
        return this.licenseService.create(userId, input);
    }

    @Query(() => [LicenseEntity])
    findLicensesByUser(@Args("userId") userId: string) {
        return this.licenseService.findLicensesByUserId(userId);
    }

    @Query(() => LicenseEntity)
    findOne(@Args("id") id: string) {
        return this.licenseService.findOne(id);
    }

    @Mutation(() => LicenseEntity)
    updateLicense(
        @Args("id") id: string,
        @Args("input") input: UpdateLicenseInput,
    ) {
        return this.licenseService.update(id, input);
    }

    @Mutation(() => LicenseEntity)
    removeLicense(@Args("id") id: string) {
        return this.licenseService.remove(id);
    }
}
