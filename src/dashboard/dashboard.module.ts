import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { DashboardResolver } from "./dashboard.resolver";
import { ContentModule } from "../content/content.module";
import { UserModule } from "../users/user.module";
import { FileModule } from "../file/file.module";

@Module({
    imports: [ContentModule, UserModule, FileModule],
    controllers: [DashboardController],
    providers: [DashboardService, DashboardResolver],
})
export class DashboardModule {}
