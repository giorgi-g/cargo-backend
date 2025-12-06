import { Module } from "@nestjs/common";
import { LicenseService } from "./license.service";
import { LicenseController } from "./license.controller";
import { LicenseResolver } from "./license.resolver";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [LicenseController],
    providers: [LicenseService, LicenseResolver, PrismaService],
})
export class LicenseModule {}
