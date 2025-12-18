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
import {
    FilterOrderDto,
    AddOrderShipmentDto,
    UpdateOrderShipmentDto,
    RemoveOrderShipmentDto,
} from "./dtos";

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
    @Get("/order/:id/shipments")
    getOrderShipments(
        @Param("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.getOrderShipments(id, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Post("/order/:id/shipments")
    addShipments(
        @Param("id") id: string,
        @Body() shipments: AddOrderShipmentDto[],
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.addShipments(id, shipments, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Put("/order/:id/shipments")
    updateShipmentPosition(
        @Param("id") id: string,
        @Body() data: UpdateOrderShipmentDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.updateShipmentPosition(id, data, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
    )
    @Delete("/order/:id/shipments")
    removeShipment(
        @Param("id") id: string,
        @Body() data: RemoveOrderShipmentDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.removeShipment(id, data, user);
    }

    // ==================== Status Management ====================

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.SALES_MANAGER,
    )
    @Put("/order/:id/status")
    updateStatus(
        @Param("id") id: string,
        @Body() body: { status: OrderStatusEnum },
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.updateStatus(id, body.status, user);
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
    @Put("/order/:id/payment")
    processPayment(
        @Param("id") id: string,
        @Body() body: { paymentMethod: PaymentMethodEnum; paymentRef?: string },
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.orderService.processPayment(
            id,
            body.paymentMethod,
            body.paymentRef || null,
            user,
        );
    }
}
