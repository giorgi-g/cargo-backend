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
import { LicenseService } from "./license.service";
import {
    CreateLicenseInput,
    UpdateLicenseInput,
    FilterLicenseDto,
} from "./types";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { Roles } from "../authorization/roles/decorators";
import { RoleEnum, DriverLicenseTypeEnum, LicenseResponse } from "@generated";

@Controller("licenses")
export class LicenseController {
    constructor(private readonly licenseService: LicenseService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
    )
    @Post("/license/:userId")
    create(
        @Param("userId") userId: string,
        @Body() input: CreateLicenseInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.licenseService.create(userId, input, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.DRIVER,
    )
    @Get("/licenses")
    findAll(
        @Query("page") page: number,
        @Query("size") size: number,
        @CurrentUser() user: CurrentUserDto,
        @Query("id") id?: string,
        @Query("name") name?: string,
        @Query("number") number?: string,
        @Query("type") type?: DriverLicenseTypeEnum,
        @Query("userId") userId?: string,
        @Query("validFrom") validFrom?: string,
        @Query("validTo") validTo?: string,
        @Query("createdAtFrom") createdAtFrom?: string,
        @Query("createdAtTo") createdAtTo?: string,
    ): Promise<LicenseResponse> {
        const request: FilterLicenseDto = {
            page,
            size,
            id,
            name,
            number,
            type,
            userId,
            validFrom,
            validTo,
            createdAtFrom,
            createdAtTo,
        };

        return this.licenseService.findAll(user, request);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.DRIVER,
    )
    @Get("/licenses/:userId")
    findLicensesByUserId(
        @Param("userId") userId: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.licenseService.findLicensesByUserId(userId, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
        RoleEnum.SALES_MANAGER,
        RoleEnum.ACCOUNTANT,
        RoleEnum.DRIVER,
    )
    @Get("/license/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.licenseService.findOne(id, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
        RoleEnum.LOGISTIC_MANAGER,
        RoleEnum.DELIVERY_MANAGER,
    )
    @Put("/license/:id")
    update(
        @Param("id") id: string,
        @Body() input: UpdateLicenseInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.licenseService.update(id, input, user);
    }

    @Roles(RoleEnum.ROOT, RoleEnum.ADMIN, RoleEnum.GENERAL_MANAGER)
    @Delete("/license/:id")
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.licenseService.remove(id, user);
    }
}
