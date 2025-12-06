import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
    CreateOrderDto,
    OrderEntity,
    OrderInput,
    OrderResponse,
    UpdateOrderDto,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { OrderService } from "./order.service";

@Injectable()
@Resolver(() => OrderEntity)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) {}

    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    createOrder(
        @Args("request") request: CreateOrderDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.create(request, user);
    }

    @Query(() => OrderResponse)
    @UseGuards(GqlAuthGuard)
    findOrders(
        @Args("request") request: OrderInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.findAll(user, request);
    }

    @Query(() => OrderEntity, { nullable: true })
    @UseGuards(GqlAuthGuard)
    findOrder(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.orderService.findOne(id, user);
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    updateOrder(
        @Args("id") id: string,
        @Args("request") request: UpdateOrderDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.update(id, request, user);
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GqlAuthGuard)
    deleteOrder(@Args("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.orderService.remove(id, user);
    }
}
