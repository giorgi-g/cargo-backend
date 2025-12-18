import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
    CreateShipmentDto,
    ShipmentEntity,
    ShipmentResponse,
    ShipmentGoodsEntity,
    ShipmentStatusEnum,
    RoleEnum,
    UpdateShipmentDto,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { ShipmentService } from "./shipment.service";
import { Roles } from "../authorization/roles/decorators";
import {
    FilterShipmentDto,
    AddShipmentGoodsDto,
    UpdateShipmentGoodsDto,
    RemoveShipmentGoodsDto,
} from "./dtos";

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

    // ==================== ShipmentGoods Management ====================

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
    @Query(() => [ShipmentGoodsEntity])
    @UseGuards(GqlAuthGuard)
    getShipmentGoods(
        @Args("shipmentId") shipmentId: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.getShipmentGoods(shipmentId, user);
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
    addShipmentGoods(
        @Args("shipmentId") shipmentId: string,
        @Args({ name: "goods", type: () => [AddShipmentGoodsDto] })
        goods: AddShipmentGoodsDto[],
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.addGoods(shipmentId, goods, user);
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
    updateShipmentGoods(
        @Args("shipmentId") shipmentId: string,
        @Args("data") data: UpdateShipmentGoodsDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.updateGoods(shipmentId, data, user);
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
    removeShipmentGoods(
        @Args("shipmentId") shipmentId: string,
        @Args("data") data: RemoveShipmentGoodsDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.removeGoods(shipmentId, data, user);
    }

    // ==================== Driver Assignment ====================

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
    )
    @Mutation(() => ShipmentEntity)
    @UseGuards(GqlAuthGuard)
    assignShipmentDriver(
        @Args("shipmentId") shipmentId: string,
        @Args("driverId", { nullable: true }) driverId: string | null,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.assignDriver(shipmentId, driverId, user);
    }

    // ==================== Status Management ====================

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
    updateShipmentStatus(
        @Args("shipmentId") shipmentId: string,
        @Args("status", { type: () => ShipmentStatusEnum })
        status: ShipmentStatusEnum,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.updateStatus(shipmentId, status, user);
    }

    // ==================== Company Participants ====================

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
    assignShipmentParticipants(
        @Args("shipmentId") shipmentId: string,
        @Args("customerId", { nullable: true }) customerId: string | null,
        @Args("supplierId", { nullable: true }) supplierId: string | null,
        @Args("logisticsId", { nullable: true }) logisticsId: string | null,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.assignParticipants(
            shipmentId,
            { customerId, supplierId, logisticsId },
            user,
        );
    }
}
