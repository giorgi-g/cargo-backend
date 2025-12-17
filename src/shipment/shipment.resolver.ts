import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
    CreateShipmentDto,
    ShipmentEntity,
    ShipmentResponse,
    RoleEnum,
    UpdateShipmentDto,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { ShipmentService } from "./shipment.service";
import { Roles } from "../authorization/roles/decorators";
import { FilterShipmentDto } from "./dtos";

@Injectable()
@Resolver(() => ShipmentEntity)
export class ShipmentResolver {
    constructor(private readonly shipmentService: ShipmentService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
    )
    @Mutation(() => ShipmentEntity)
    @UseGuards(GqlAuthGuard)
    createShipment(
        @Args("request") request: CreateShipmentDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.create(request, user);
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
    @Query(() => ShipmentResponse)
    @UseGuards(GqlAuthGuard)
    findShipments(
        @Args("request") request: FilterShipmentDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.findAll(user, request);
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
    @Query(() => ShipmentEntity, { nullable: true })
    @UseGuards(GqlAuthGuard)
    findShipment(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.findOne(id, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
    )
    @Mutation(() => ShipmentEntity)
    @UseGuards(GqlAuthGuard)
    updateShipment(
        @Args("id") id: string,
        @Args("request") request: UpdateShipmentDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.update(id, request, user);
    }

    @Roles(RoleEnum.ROOT, RoleEnum.ADMIN, RoleEnum.GENERAL_MANAGER)
    @Mutation(() => ShipmentEntity)
    @UseGuards(GqlAuthGuard)
    deleteShipment(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.remove(id, user);
    }
}
