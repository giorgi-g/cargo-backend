import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
} from "@nestjs/common";
import { TransportService } from "./transport.service";
import {
    RoleEnum,
    TransportBrandsEnum,
    TransportModeEnum,
    VehicleTypeEnum,
    TransportColorEnum,
    SteeringWheelSideEnum,
    TransmissionTypeEnum,
    FuelTypeEnum,
    TransportResponse,
} from "@generated";
import {
    CreateTransportInput,
    UpdateTransportInput,
    FilterTransportDto,
} from "./types";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { Roles } from "../authorization/roles/decorators";

@Controller("transports")
export class TransportController {
    constructor(private readonly transportService: TransportService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
    )
    @Post("/transport/:userId")
    create(
        @Param("userId") userId: string,
        @Body() createTransportDto: CreateTransportInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.create(userId, createTransportDto, user);
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
    @Get("/transports")
    findAll(
        @Query("page") page: number,
        @Query("size") size: number,
        @CurrentUser() user: CurrentUserDto,
        @Query("id") id?: string,
        @Query("brand") brand?: TransportBrandsEnum,
        @Query("model") model?: string,
        @Query("yearFrom") yearFrom?: number,
        @Query("yearTo") yearTo?: number,
        @Query("licensePlate") licensePlate?: string,
        @Query("type") type?: TransportModeEnum,
        @Query("vehicleType") vehicleType?: VehicleTypeEnum,
        @Query("color") color?: TransportColorEnum,
        @Query("steeringWheelSide") steeringWheelSide?: SteeringWheelSideEnum,
        @Query("transmission") transmission?: TransmissionTypeEnum,
        @Query("fuelType") fuelType?: FuelTypeEnum,
        @Query("isTurbo") isTurbo?: boolean,
        @Query("userId") userId?: string,
        @Query("notes") notes?: string,
        @Query("inspectionValidFrom") inspectionValidFrom?: string,
        @Query("inspectionValidTo") inspectionValidTo?: string,
        @Query("insuranceValidFrom") insuranceValidFrom?: string,
        @Query("insuranceValidTo") insuranceValidTo?: string,
    ): Promise<TransportResponse> {
        const request: FilterTransportDto = {
            page,
            size,
            id,
            brand,
            model,
            yearFrom: yearFrom ? Number(yearFrom) : undefined,
            yearTo: yearTo ? Number(yearTo) : undefined,
            licensePlate,
            type,
            vehicleType,
            color,
            steeringWheelSide,
            transmission,
            fuelType,
            isTurbo:
                isTurbo !== undefined ? isTurbo === true || isTurbo === ("true" as any) : undefined,
            userId,
            notes,
            inspectionValidFrom,
            inspectionValidTo,
            insuranceValidFrom,
            insuranceValidTo,
        };

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
    @Get("/transports/:userId")
    findAllByUserId(
        @Param("userId") userId: string,
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
    @Get("/transport/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
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
    @Put("/transport/:id")
    update(
        @Param("id") id: string,
        @Body() data: UpdateTransportInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.update(id, data, user);
    }

    @Roles(RoleEnum.ROOT, RoleEnum.ADMIN, RoleEnum.GENERAL_MANAGER)
    @Delete("/transport/:id")
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.transportService.remove(id, user);
    }
}
