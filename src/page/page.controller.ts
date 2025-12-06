import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from "@nestjs/common";
import { PageService } from "./page.service";
import { CreatePageDto, UpdatePageDto } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";

@Controller("pages")
export class PageController {
    constructor(private readonly pageService: PageService) {}

    @Post("/page")
    create(
        @Body() createPageDto: CreatePageDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.pageService.create(createPageDto, user);
    }

    @Get("/pages")
    findAll(@CurrentUser() user: CurrentUserDto) {
        return this.pageService.findAll(user);
    }

    @Get("/page/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.pageService.findOne(id, user);
    }

    @Put("/page/:id")
    update(
        @Param("id") id: string,
        @Body() updatePageDto: UpdatePageDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.pageService.update(id, updatePageDto, user);
    }

    @Delete("/page/:id")
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.pageService.remove(id, user);
    }
}
