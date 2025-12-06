import { Module } from "@nestjs/common";
import { PackageService } from "./package.service";
import { PackageController } from "./package.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PackageResolver } from "./package.resolver";

@Module({
    controllers: [PackageController],
    providers: [PackageService, PrismaService, PackageResolver],
})
export class PackageModule {}
