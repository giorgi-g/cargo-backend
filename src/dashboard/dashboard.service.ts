import { Injectable } from "@nestjs/common";
import { CurrentUserDto } from "../users/dtos";
import { DashboardInfoDto } from "./dtos";
import { ContentService } from "../content/content.service";
import { UserService } from "../users/user.service";
import { ContentTypeEnum, RoleEnum } from "@generated";
import { FileService } from "../file/file.service";

@Injectable()
export class DashboardService {
    constructor(
        private readonly contentService: ContentService,
        private readonly userService: UserService,
        private readonly fileService: FileService,
    ) {}

    async info({ companyId }: CurrentUserDto): Promise<DashboardInfoDto> {
        return {
            drivers: await this.userService.count(companyId, RoleEnum.DRIVER),
            guides: await this.userService.count(companyId, RoleEnum.GUIDE),
            destinations: await this.contentService.count(
                companyId,
                ContentTypeEnum.DESTINATION,
            ),
            tours: await this.contentService.count(
                companyId,
                ContentTypeEnum.TOUR,
            ),
            transfers: await this.contentService.count(
                companyId,
                ContentTypeEnum.TRANSFER,
            ),
            accommodations: await this.contentService.count(
                companyId,
                ContentTypeEnum.ACCOMMODATION,
            ),
            cafes: await this.contentService.count(
                companyId,
                ContentTypeEnum.CAFE,
            ),
            files: await this.fileService.count(companyId),
        };
    }
}
