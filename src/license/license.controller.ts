import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
} from "@nestjs/common";
import { LicenseService } from "./license.service";
import { CreateLicenseInput, UpdateLicenseInput } from "./types";

@Controller("licenses")
export class LicenseController {
    constructor(private readonly licenseService: LicenseService) {}

    @Post("/license/:userId")
    create(@Param("userId") userId: string, @Body() input: CreateLicenseInput) {
        return this.licenseService.create(userId, input);
    }

    @Get("/licenses/:userId")
    findLicensesByUserId(@Param("userId") userId: string) {
        return this.licenseService.findLicensesByUserId(userId);
    }

    @Get("/license/:id")
    findOne(@Param("id") id: string) {
        return this.licenseService.findOne(id);
    }

    @Put("/license/:id")
    update(@Param("id") id: string, @Body() input: UpdateLicenseInput) {
        console.log(">>> input", input);
        return this.licenseService.update(id, input);
    }

    @Delete("/license/:id")
    remove(@Param("id") id: string) {
        return this.licenseService.remove(id);
    }
}
