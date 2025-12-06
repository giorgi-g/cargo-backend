import { Module } from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { CurrencyController } from "./currency.controller";
import { PrismaService } from "../prisma/prisma.service";
import { CurrencyResolver } from "./currency.resolver";

@Module({
    imports: [],
    controllers: [CurrencyController],
    providers: [CurrencyService, PrismaService, CurrencyResolver],
})
export class CurrencyModule {}
