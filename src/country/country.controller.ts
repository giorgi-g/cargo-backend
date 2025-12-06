import { Controller, Get, Post, Body, Param, Put } from "@nestjs/common";
import { CountryService } from "./country.service";
import { CreateCountryDto, UpdateCountryDto } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";

@Controller("countries")
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @Post("/country")
    create(
        @Body() request: CreateCountryDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.countryService.create(request);
    }

    @Get("/countries")
    findAll() {
        return this.countryService.findAll();
    }

    @Get("/country/:id")
    findOne(@Param("id") id: number) {
        return this.countryService.findOne(id);
    }

    @Put("/country/:id")
    update(
        @Param("id") id: number,
        @Body() updateCountryDto: UpdateCountryDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.countryService.update(id, updateCountryDto);
    }
}
