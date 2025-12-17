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
            logisticManagers: await this.userService.count(
                companyId,
                RoleEnum.LOGISTIC_MANAGER,
            ),
            destinations: await this.contentService.count(
                companyId,
                ContentTypeEnum.DESTINATION,
            ),
            goods: await this.contentService.count(
                companyId,
                ContentTypeEnum.GOODS,
            ),
            transfers: await this.contentService.count(
                companyId,
                ContentTypeEnum.TRANSFER,
            ),
            services: await this.contentService.count(
                companyId,
                ContentTypeEnum.SERVICE,
            ),
            files: await this.fileService.count(companyId),
        };
    }
}
