import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TransportService } from "./transport.service";
import { TransportEntity, TransportResponse, RoleEnum } from "@generated";
import {
    CreateTransportInput,
    UpdateTransportInput,
    FilterTransportDto,
} from "./types";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { Roles } from "../authorization/roles/decorators";

@Resolver(() => TransportEntity)
export class TransportResolver {
    constructor(private readonly transportService: TransportService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
    )
    @Mutation(() => TransportEntity)
    @UseGuards(GqlAuthGuard)
    createTransport(
        @Args("userId", { type: () => String }) userId: string,
        @Args("input") input: CreateTransportInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.create(userId, input, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.DRIVER,
    )
    @Query(() => TransportResponse)
    @UseGuards(GqlAuthGuard)
    findTransports(
        @Args("request") request: FilterTransportDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.findAll(user, request);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.DRIVER,
    )
    @Query(() => [TransportEntity])
    @UseGuards(GqlAuthGuard)
    findTransportsByUserId(
        @Args("userId", { type: () => String }) userId: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.findAllByUserId(userId, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.DRIVER,
    )
    @Query(() => TransportEntity, { nullable: true })
    @UseGuards(GqlAuthGuard)
    findTransport(
        @Args("id", { type: () => String }) id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.findOne(id, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
    )
    @Mutation(() => TransportEntity)
    @UseGuards(GqlAuthGuard)
    updateTransport(
        @Args("id", { type: () => String }) id: string,
        @Args("input") input: UpdateTransportInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.update(id, input, user);
    }

    @Roles(RoleEnum.ROOT, RoleEnum.ADMIN, RoleEnum.GENERAL_MANAGER)
    @Mutation(() => TransportEntity)
    @UseGuards(GqlAuthGuard)
    removeTransport(
        @Args("id", { type: () => String }) id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.remove(id, user);
    }
}
