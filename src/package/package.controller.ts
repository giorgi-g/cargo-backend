import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from "@nestjs/common";
import { PackageService } from "./package.service";
import { CreatePackageDto, UpdatePackageDto } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";

@Controller("packages")
export class PackageController {
    constructor(private readonly packageService: PackageService) {}

    @Post("/package")
    create(
        @Body() createPackageDto: CreatePackageDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.packageService.create(createPackageDto, user);
    }

    @Get("/packages")
    findAll(@CurrentUser() user: CurrentUserDto) {
        return this.packageService.findAll(user);
    }

    @Get("/package/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.packageService.findOne(id, user);
    }

    @Put("/package/:id")
    update(
        @Param("id") id: string,
        @Body() updatePackageDto: UpdatePackageDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.packageService.update(id, updatePackageDto, user);
    }

    @Delete("/package/:id")
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.packageService.remove(id, user);
    }
}
