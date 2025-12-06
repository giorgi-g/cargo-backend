import { Module } from "@nestjs/common";
import { CountryService } from "./country.service";
import { CountryController } from "./country.controller";
import { PrismaService } from "../prisma/prisma.service";
import { CountryResolver } from "./country.resolver";

@Module({
    imports: [],
    controllers: [CountryController],
    providers: [CountryService, PrismaService, CountryResolver],
})
export class CountryModule {}
