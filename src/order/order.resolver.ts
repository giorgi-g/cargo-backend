import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
    CreateOrderDto,
    OrderEntity,
    OrderResponse,
    OrderShipmentEntity,
    OrderStatusEnum,
    PaymentMethodEnum,
    RoleEnum,
    UpdateOrderDto,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { OrderService } from "./order.service";
import { Roles } from "../authorization/roles/decorators";
import {
    FilterOrderDto,
    AddOrderShipmentDto,
    UpdateOrderShipmentDto,
    RemoveOrderShipmentDto,
} from "./dtos";

@Injectable()
@Resolver(() => OrderEntity)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    createOrder(
        @Args("request") request: CreateOrderDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.create(request, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Query(() => OrderResponse)
    @UseGuards(GqlAuthGuard)
    findOrders(
        @Args("request") request: FilterOrderDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.findAll(user, request);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Query(() => OrderEntity, { nullable: true })
    @UseGuards(GqlAuthGuard)
    findOrder(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.orderService.findOne(id, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
    )
    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    updateOrder(
        @Args("id") id: string,
        @Args("request") request: UpdateOrderDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.update(id, request, user);
    }

    @Roles(RoleEnum.ROOT, RoleEnum.ADMIN, RoleEnum.GENERAL_MANAGER)
    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    deleteOrder(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.orderService.remove(id, user);
    }

    // ==================== OrderShipment Management ====================

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Query(() => [OrderShipmentEntity])
    @UseGuards(GqlAuthGuard)
    getOrderShipments(
        @Args("orderId") orderId: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.getOrderShipments(orderId, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    addOrderShipments(
        @Args("orderId") orderId: string,
        @Args({ name: "shipments", type: () => [AddOrderShipmentDto] })
        shipments: AddOrderShipmentDto[],
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.addShipments(orderId, shipments, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    updateOrderShipmentPosition(
        @Args("orderId") orderId: string,
        @Args("data") data: UpdateOrderShipmentDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.updateShipmentPosition(orderId, data, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    removeOrderShipment(
        @Args("orderId") orderId: string,
        @Args("data") data: RemoveOrderShipmentDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.removeShipment(orderId, data, user);
    }

    // ==================== Status Management ====================

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
    )
    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    updateOrderStatus(
        @Args("orderId") orderId: string,
        @Args("status", { type: () => OrderStatusEnum }) status: OrderStatusEnum,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.updateStatus(orderId, status, user);
    }

    // ==================== Payment Processing ====================

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
    )
    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    processOrderPayment(
        @Args("orderId") orderId: string,
        @Args("paymentMethod", { type: () => PaymentMethodEnum })
        paymentMethod: PaymentMethodEnum,
        @Args("paymentRef", { nullable: true }) paymentRef: string | null,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.processPayment(
            orderId,
            paymentMethod,
            paymentRef,
            user,
        );
    }
}
