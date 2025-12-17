import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
} from "@nestjs/common";
import { ContentService } from "./content.service";
import {
    CargoTypeEnum,
    ContentStatusEnum,
    ContentTypeEnum,
    HazardClassEnum,
    RoleEnum,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import {
    ContentDto,
    CreateContentInput,
    FilterContentDto,
    UpdateContentInput,
} from "./dtos";
import { Roles } from "../authorization/roles/decorators";

@Controller("content")
export class ContentController {
    constructor(private readonly contentService: ContentService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.RESERVATIONS_MANAGER,
    )
    @Post("/content")
    create(
        @Body() req: CreateContentInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.contentService.create(req, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.ACCOUNTANT,
        RoleEnum.HR_MANAGER,
        RoleEnum.RESERVATIONS_MANAGER,
    )
    @Get("/contents")
    findAll(
        @CurrentUser() user: CurrentUserDto,
        @Query("langId") langId: number,
        @Query("contentType") contentType: ContentTypeEnum,
        @Query("title") title?: string,
        @Query("slug") slug?: string,
        @Query("statuses") statuses?: ContentStatusEnum[],
        @Query("pageIds") pageIds?: string[],
        @Query("cityId") cityId?: number,
        @Query("startDate") startDate?: Date,
        @Query("endDate") endDate?: Date,
        @Query("cargoType") cargoType?: CargoTypeEnum,
        @Query("hazardClass") hazardClass?: HazardClassEnum,
        @Query("isPublic") isPublic?: boolean,
    ) {
        const request: FilterContentDto = {
            langId,
            contentType,
            title,
            slug,
            statuses,
            pageIds,
            cityId,
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
            cargoType,
            hazardClass,
            isPublic,
        };
        return this.contentService.findAll(user, request);
    }

    @Get("/content/:itemId")
    findOne(
        @Param("itemId") itemId: string,
        @CurrentUser() user: CurrentUserDto,
        @Query("langId") langId: number,
    ): Promise<ContentDto | null> {
        return this.contentService.findOne(itemId, user, langId);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.RESERVATIONS_MANAGER,
    )
    @Put("/content/:id")
    update(
        @Param("id") id: string,
        @Body() req: UpdateContentInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.contentService.update(id, req, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
    )
    @Delete("/content/:id")
    delete(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.contentService.remove(id, user);
    }
}
