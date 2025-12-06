import { Injectable, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { Mutation, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { DashboardInfoDto } from "./dtos";

@Injectable()
@Resolver(() => DashboardInfoDto)
export class DashboardResolver {
    constructor(private readonly dashboardService: DashboardService) {}

    @Mutation(() => DashboardInfoDto)
    @UseGuards(GqlAuthGuard)
    getDashboardInfo(
        @CurrentUser() user: CurrentUserDto,
    ): Promise<DashboardInfoDto> {
        return this.dashboardService.info(user);
    }
}
