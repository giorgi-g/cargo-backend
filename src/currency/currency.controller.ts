import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { CreateCurrencyInput } from "./dtos/create-currency.input";
import { Roles } from "../authorization/roles/decorators/role.decorator";
import { RoleEnum } from "@generated";

@Controller("currencies")
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Post("/currency")
    @Roles(RoleEnum.ROOT)
    create(
        @Body() request: CreateCurrencyInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.currencyService.create(request, user);
    }

    @Get("/currencies")
    findAll(@CurrentUser() user: CurrentUserDto) {
        return this.currencyService.findAll(user);
    }

    @Get("/currency/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.currencyService.findOne(id, user);
    }

    @Put("/currency/:id")
    @Roles(RoleEnum.ROOT)
    update(
        @Param("id") id: string,
        @Body() request: CreateCurrencyInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.currencyService.update(id, request, user);
    }

    @Delete("/currency/:id")
    @Roles(RoleEnum.ROOT)
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.currencyService.remove(id, user);
    }
}
