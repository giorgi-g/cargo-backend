import { Module } from "@nestjs/common";
import { LanguageService } from "./language.service";
import { LanguageController } from "./language.controller";
import { PrismaService } from "../prisma/prisma.service";
import { LanguageResolver } from "./language.resolver";

@Module({
    imports: [],
    controllers: [LanguageController],
    providers: [LanguageService, PrismaService, LanguageResolver],
})
export class LanguageModule {}
