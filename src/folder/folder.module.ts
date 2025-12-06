import { Module } from "@nestjs/common";
import { FolderService } from "./folder.service";
import { FolderController } from "./folder.controller";
import { PrismaService } from "../prisma/prisma.service";
import { FolderResolver } from "./folder.resolver";

@Module({
    controllers: [FolderController],
    providers: [FolderService, PrismaService, FolderResolver],
})
export class FolderModule {}
