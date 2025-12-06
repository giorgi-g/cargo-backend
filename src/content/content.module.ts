import { Module } from "@nestjs/common";
import { ContentService } from "./content.service";
import { ContentController } from "./content.controller";
import { PrismaService } from "../prisma/prisma.service";
import { ContentResolver } from "./content.resolver";

@Module({
    controllers: [ContentController],
    providers: [ContentService, PrismaService, ContentResolver],
    exports: [ContentService],
})
export class ContentModule {}
