import { Injectable, UseGuards } from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { CurrencyEntity, RoleEnum } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { CreateCurrencyInput } from "./dtos/create-currency.input";
import { Roles } from "../authorization/roles/decorators/role.decorator";

@Injectable()
@Resolver(() => CurrencyEntity)
export class CurrencyResolver {
    constructor(private readonly currencyService: CurrencyService) {}

    @Mutation(() => CurrencyEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    createCurrency(
        @Args("request") request: CreateCurrencyInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.currencyService.create(request, user);
    }

    @Query(() => [CurrencyEntity])
    @UseGuards(GqlAuthGuard)
    findCurrencies(@CurrentUser() user: CurrentUserDto) {
        return this.currencyService.findAll(user);
    }

    @Query(() => [CurrencyEntity])
    @UseGuards(GqlAuthGuard)
    findCurrencyById(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.currencyService.findOne(id, user);
    }

    @Mutation(() => CurrencyEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    updateCurrency(
        @Args("id") id: string,
        @Args("request") request: CreateCurrencyInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.currencyService.update(id, request, user);
    }

    @Mutation(() => CurrencyEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    deleteCurrency(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.currencyService.remove(id, user);
    }
}
