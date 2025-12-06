import { Module } from "@nestjs/common";
import { PageService } from "./page.service";
import { PageController } from "./page.controller";
import { PageResolver } from "./page.resolver";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [PageController],
    providers: [PageService, PageResolver, PrismaService],
    exports: [PageService],
})
export class PageModule {}
