import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { ApiProperty } from "@nestjs/swagger";
import { DashboardInfoDto } from "./dtos";

@Controller("dashboard")
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get("/info")
    @ApiProperty({
        type: DashboardInfoDto,
    })
    info(@CurrentUser() user: CurrentUserDto) {
        return this.dashboardService.info(user);
    }
}
