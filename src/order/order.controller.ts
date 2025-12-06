import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import {
    CreateOrderDto,
    OrderInput,
    OrderResponse,
    UpdateOrderDto,
    OrderStatusEnum,
    PaymentMethodEnum,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { OrderService } from "./order.service";

@Controller("orders")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get("/orders")
    findAll(
        @Query("page") page: number,
        @Query("size") size: number,
        @CurrentUser() user: CurrentUserDto,
        @Query("id") id?: string,
        @Query("status") status?: OrderStatusEnum,
        @Query("userId") userId?: string,
        @Query("currencyId") currencyId?: string,
        @Query("paymentMethod") paymentMethod?: PaymentMethodEnum,
    ): Promise<OrderResponse> {
        const request: OrderInput = {
            page,
            size,
            id,
            status,
            userId,
            currencyId,
            paymentMethod,
        };

        return this.orderService.findAll(user, request);
    }

    @Get("/order/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.orderService.findOne(id, user);
    }

    @Post("/order")
    create(
        @Body() createOrderDto: CreateOrderDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.create(createOrderDto, user);
    }

    @Put("/order/:id")
    update(
        @Param("id") id: string,
        @Body() updateOrderDto: UpdateOrderDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.update(id, updateOrderDto, user);
    }

    @Delete("/order/:id")
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.orderService.remove(id, user);
    }
}
