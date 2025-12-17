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
    OrderResponse,
    UpdateOrderDto,
    OrderStatusEnum,
    PaymentMethodEnum,
    RoleEnum,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { OrderService } from "./order.service";
import { Roles } from "../authorization/roles/decorators";
import { FilterOrderDto } from "./dtos";

@Controller("orders")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.LOGISTIC_MANAGER,
    )
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
        @Query("startDate") startDate?: string,
        @Query("endDate") endDate?: string,
        @Query("notes") notes?: string,
    ): Promise<OrderResponse> {
        const request: FilterOrderDto = {
            page,
            size,
            id,
            status,
            userId,
            currencyId,
            paymentMethod,
            startDate,
            endDate,
            notes,
        };

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
    @Get("/order/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.orderService.findOne(id, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Post("/order")
    create(
        @Body() createOrderDto: CreateOrderDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.create(createOrderDto, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
    )
    @Put("/order/:id")
    update(
        @Param("id") id: string,
        @Body() updateOrderDto: UpdateOrderDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.update(id, updateOrderDto, user);
    }

    @Roles(RoleEnum.ROOT, RoleEnum.ADMIN, RoleEnum.GENERAL_MANAGER)
    @Delete("/order/:id")
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.orderService.remove(id, user);
    }
}
