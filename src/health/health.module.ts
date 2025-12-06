import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthResolver } from "./health.resolver";
import { HealthController } from "./health.controller";

@Module({
    imports: [ConfigModule],
    controllers: [HealthController],
    providers: [HealthResolver],
})
export class HealthModule {}
