import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto, RoleEnum, UpdateCompanyDto } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { Roles } from "../authorization/roles/decorators";

@Controller("companies")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Post("/company")
    create(
        @CurrentUser() user: CurrentUserDto,
        @Body() request: CreateCompanyDto,
    ) {
        return this.companyService.create(request, user);
    }

    @Get("/companies")
    @Roles(RoleEnum.ROOT)
    findAll(@CurrentUser() user: CurrentUserDto) {
        return this.companyService.findAll();
    }

    @Get("/company/:id")
    findOne(@Param("id") id: string) {
        return this.companyService.findOne(id);
    }

    @Put("/company/:id")
    update(
        @CurrentUser() user: CurrentUserDto,
        @Param("id") id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        return this.companyService.update(id, updateCompanyDto, user);
    }

    @Delete("/company/:id")
    remove(@CurrentUser() user: CurrentUserDto, @Param("id") id: string) {
        return this.companyService.delete(id, user.companyId);
    }
}
