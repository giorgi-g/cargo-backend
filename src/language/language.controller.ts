import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { LanguageService } from "./language.service";
import { CreateLanguageDto, RoleEnum, UpdateLanguageDto } from "@generated";
import { Roles } from "../authorization/roles/decorators/role.decorator";

@Controller("languages")
export class LanguageController {
    constructor(private readonly languageService: LanguageService) {}

    @Post("/language")
    @Roles(RoleEnum.ROOT)
    create(@Body() createLanguageDto: CreateLanguageDto) {
        return this.languageService.create(createLanguageDto);
    }

    @Get("/languages")
    findAll() {
        return this.languageService.findAll();
    }

    @Get("/language/:id")
    findOne(@Param("id") id: number) {
        return this.languageService.findOne(id);
    }

    @Roles(RoleEnum.ROOT)
    @Put("/language/:id")
    update(
        @Param("id") id: number,
        @Body() updateLanguageDto: UpdateLanguageDto,
    ) {
        return this.languageService.update(id, updateLanguageDto);
    }

    @Roles(RoleEnum.ROOT)
    @Delete("/language/:id")
    remove(@Param("id") id: number) {
        return this.languageService.remove(id);
    }
}
