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
import { CompanyService } from "./company.service";
import { CreateCompanyDto, RoleEnum, UpdateCompanyDto } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { FilterCompanyDto } from "./dtos";
import { Roles } from "../authorization/roles/decorators";

@Controller("companies")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Roles(RoleEnum.ROOT)
    @Post("/company")
    create(
        @CurrentUser() user: CurrentUserDto,
        @Body() request: CreateCompanyDto,
    ) {
        return this.companyService.create(request, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.ACCOUNTANT,
    )
    @Get("/companies")
    findAll(
        @CurrentUser() user: CurrentUserDto,
        @Query() request: FilterCompanyDto,
    ) {
        return this.companyService.findAll(user, request);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.ACCOUNTANT,
    )
    @Get("/company/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.companyService.findOne(id, user);
    }

    @Roles(RoleEnum.ROOT, RoleEnum.ADMIN, RoleEnum.GENERAL_MANAGER)
    @Put("/company/:id")
    update(
        @CurrentUser() user: CurrentUserDto,
        @Param("id") id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        return this.companyService.update(id, updateCompanyDto, user);
    }

    @Roles(RoleEnum.ROOT)
    @Delete("/company/:id")
    remove(@CurrentUser() user: CurrentUserDto, @Param("id") id: string) {
        return this.companyService.delete(id, user);
    }
}
