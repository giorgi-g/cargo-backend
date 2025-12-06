import { Injectable, UseGuards } from "@nestjs/common";
import { CountryService } from "./country.service";
import {
    CountryEntity,
    CreateCountryDto,
    RoleEnum,
    UpdateCountryDto,
} from "@generated";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { Roles } from "../authorization/roles/decorators";

@Injectable()
@Resolver(() => CountryEntity)
export class CountryResolver {
    constructor(private readonly countryService: CountryService) {}

    @Mutation(() => CountryEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    createCountry(@Args("request") request: CreateCountryDto) {
        return this.countryService.create(request);
    }

    @Query(() => [CountryEntity])
    @UseGuards(GqlAuthGuard)
    findCountries() {
        return this.countryService.findAll();
    }

    @Query(() => CountryEntity)
    @UseGuards(GqlAuthGuard)
    findCountryById(@Args("id") id: number) {
        return this.countryService.findOne(id);
    }

    @Mutation(() => CountryEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    updateCountry(
        @Args("id") id: number,
        @Args("request") request: UpdateCountryDto,
    ) {
        return this.countryService.update(id, request);
    }
}
