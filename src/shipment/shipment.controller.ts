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
    CreateShipmentDto,
    ShipmentResponse,
    UpdateShipmentDto,
    ShipmentStatusEnum,
    ShipmentTypeEnum,
    ServiceTypeEnum,
    PaymentMethodEnum,
    RoleEnum,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { ShipmentService } from "./shipment.service";
import { Roles } from "../authorization/roles/decorators";
import {
    FilterShipmentDto,
    AddShipmentGoodsDto,
    UpdateShipmentGoodsDto,
    RemoveShipmentGoodsDto,
} from "./dtos";

@Controller("shipments")
export class ShipmentController {
    constructor(private readonly shipmentService: ShipmentService) {}

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
    @Get("/shipments")
    findAll(
        @Query("page") page: number,
        @Query("size") size: number,
        @CurrentUser() user: CurrentUserDto,
        @Query("id") id?: string,
        @Query("status") status?: ShipmentStatusEnum,
        @Query("shipmentType") shipmentType?: ShipmentTypeEnum,
        @Query("serviceType") serviceType?: ServiceTypeEnum,
        @Query("userId") userId?: string,
        @Query("driverId") driverId?: string,
        @Query("departureId") departureId?: string,
        @Query("arrivalId") arrivalId?: string,
        @Query("customerId") customerId?: string,
        @Query("supplierId") supplierId?: string,
        @Query("logisticsId") logisticsId?: string,
        @Query("currencyId") currencyId?: string,
        @Query("paymentMethod") paymentMethod?: PaymentMethodEnum,
        @Query("startDateFrom") startDateFrom?: string,
        @Query("startDateTo") startDateTo?: string,
        @Query("createdAtFrom") createdAtFrom?: string,
        @Query("createdAtTo") createdAtTo?: string,
        @Query("notes") notes?: string,
    ): Promise<ShipmentResponse> {
        const request: FilterShipmentDto = {
            page,
            size,
            id,
            status,
            shipmentType,
            serviceType,
            userId,
            driverId,
            departureId,
            arrivalId,
            customerId,
            supplierId,
            logisticsId,
            currencyId,
            paymentMethod,
            startDateFrom,
            startDateTo,
            createdAtFrom,
            createdAtTo,
            notes,
        };

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
    @Get("/shipment/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
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
    @Post("/shipment")
    create(
        @Body() createShipmentDto: CreateShipmentDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.create(createShipmentDto, user);
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
    @Put("/shipment/:id")
    update(
        @Param("id") id: string,
        @Body() updateShipmentDto: UpdateShipmentDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.update(id, updateShipmentDto, user);
    }

    @Roles(RoleEnum.ROOT, RoleEnum.ADMIN, RoleEnum.GENERAL_MANAGER)
    @Delete("/shipment/:id")
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
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
    @Get("/shipment/:id/goods")
    getShipmentGoods(
        @Param("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.getShipmentGoods(id, user);
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
    @Post("/shipment/:id/goods")
    addGoods(
        @Param("id") id: string,
        @Body() goods: AddShipmentGoodsDto[],
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.addGoods(id, goods, user);
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
    @Put("/shipment/:id/goods")
    updateGoods(
        @Param("id") id: string,
        @Body() data: UpdateShipmentGoodsDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.updateGoods(id, data, user);
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
    @Delete("/shipment/:id/goods")
    removeGoods(
        @Param("id") id: string,
        @Body() data: RemoveShipmentGoodsDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.removeGoods(id, data, user);
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
    @Put("/shipment/:id/driver")
    assignDriver(
        @Param("id") id: string,
        @Body() body: { driverId: string | null },
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.assignDriver(id, body.driverId, user);
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
    @Put("/shipment/:id/status")
    updateStatus(
        @Param("id") id: string,
        @Body() body: { status: ShipmentStatusEnum },
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.updateStatus(id, body.status, user);
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
    @Put("/shipment/:id/participants")
    assignParticipants(
        @Param("id") id: string,
        @Body()
        body: {
            customerId?: string | null;
            supplierId?: string | null;
            logisticsId?: string | null;
        },
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.shipmentService.assignParticipants(id, body, user);
    }
}
